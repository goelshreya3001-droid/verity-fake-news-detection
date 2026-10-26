import os
import pathlib
import json
from typing import Tuple
import pandas as pd
from sklearn.model_selection import train_test_split
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.pipeline import Pipeline
from sklearn.linear_model import LogisticRegression
from sklearn.naive_bayes import MultinomialNB
from sklearn.svm import LinearSVC
from sklearn.metrics import (
    accuracy_score,
    precision_score,
    recall_score,
    f1_score,
    confusion_matrix,
    classification_report,
)
import joblib
import warnings
warnings.filterwarnings("ignore")

DATASET_DIR = pathlib.Path(__file__).parent.parent / "datasets"
ARTIFACT_DIR = pathlib.Path(__file__).parent / "artifacts"
ARTIFACT_DIR.mkdir(parents=True, exist_ok=True)

def load_and_label() -> pd.DataFrame:
    # Load CSVs
    fake_path = DATASET_DIR / "Fake.csv"
    true_path = DATASET_DIR / "True.csv"
    if not fake_path.is_file() or not true_path.is_file():
        raise FileNotFoundError("Both Fake.csv and True.csv must be present in the datasets folder.")
    # Guess encoding, use utf-8 and fallback to latin1
    df_fake = pd.read_csv(
    fake_path,
    encoding="utf-8",
    on_bad_lines="skip"
)
    df_true = pd.read_csv(true_path, encoding="utf-8", on_bad_lines="skip")
    # Add label column
    df_fake["label"] = 0
    df_true["label"] = 1
    df = pd.concat([df_fake, df_true], ignore_index=True)
    return df

def preprocess(df: pd.DataFrame) -> Tuple[pd.Series, pd.Series]:
    # Identify text columns – try common names
    text_cols = []
    for col in df.columns:
        if col.lower() in ["title", "headline", "text", "article", "content", "body"]:
            text_cols.append(col)
    if not text_cols:
        raise ValueError("Could not find a textual column in the dataset. Please ensure the CSV contains a column with article text.")
    # Combine text columns into a single string
    df["combined_text"] = df[text_cols].astype(str).apply(lambda x: " ".join(x), axis=1)
    # Basic cleaning: remove html tags, extra whitespace
    df["combined_text"] = df["combined_text"].str.replace(r"<[^>]*>", " ", regex=True)
    df["combined_text"] = df["combined_text"].str.replace(r"\s+", " ", regex=True).str.strip()
    # Drop rows with empty text
    df = df[df["combined_text"].str.len() > 0]
    X = df["combined_text"]
    y = df["label"]
    return X, y

def build_pipelines():
    pipelines = {
        "logreg": Pipeline([
            ("tfidf", TfidfVectorizer(ngram_range=(1, 2), max_features=20000)),
            ("clf", LogisticRegression(max_iter=1000, n_jobs=-1)),
        ]),
        "naive_bayes": Pipeline([
            ("tfidf", TfidfVectorizer(ngram_range=(1, 2), max_features=20000)),
            ("clf", MultinomialNB()),
        ]),
        "linear_svc": Pipeline([
            ("tfidf", TfidfVectorizer(ngram_range=(1, 2), max_features=20000)),
            ("clf", LinearSVC()),
        ]),
    }
    return pipelines

def evaluate(pipeline, X_test, y_test):
    preds = pipeline.predict(X_test)
    metrics = {
        "accuracy": accuracy_score(y_test, preds),
        "precision": precision_score(y_test, preds, zero_division=0),
        "recall": recall_score(y_test, preds, zero_division=0),
        "f1": f1_score(y_test, preds, zero_division=0),
        "confusion_matrix": confusion_matrix(y_test, preds).tolist(),
        "classification_report": classification_report(y_test, preds, output_dict=True),
    }
    return metrics

def main():
    print("Loading data...")
    df = load_and_label()
    print(f"Total rows loaded: {len(df)}")
    X, y = preprocess(df)
    print(f"Rows after cleaning: {len(X)}")
    # Split – stratify to keep class balance
    X_train, X_temp, y_train, y_temp = train_test_split(
        X, y, test_size=0.2, random_state=42, stratify=y
    )
    X_val, X_test, y_val, y_test = train_test_split(
        X_temp, y_temp, test_size=0.5, random_state=42, stratify=y_temp
    )
    pipelines = build_pipelines()
    best_score = -1
    best_name = None
    best_pipeline = None
    best_metrics = None
    print("Training models...")
    for name, pipe in pipelines.items():
        pipe.fit(X_train, y_train)
        val_metrics = evaluate(pipe, X_val, y_val)
        print(f"{name} – validation F1: {val_metrics['f1']:.4f}")
        if val_metrics["f1"] > best_score:
            best_score = val_metrics["f1"]
            best_name = name
            best_pipeline = pipe
            best_metrics = val_metrics
    # Final evaluation on test set
    test_metrics = evaluate(best_pipeline, X_test, y_test)
    # Merge validation and test metrics for reporting
    report = {
        "selected_model": best_name,
        "validation_metrics": best_metrics,
        "test_metrics": test_metrics,
    }
    # Save pipeline
    model_path = ARTIFACT_DIR / "model.joblib"
    joblib.dump(best_pipeline, model_path)
    print(f"Saved model to {model_path}")
    # Save metrics JSON
    metrics_path = ARTIFACT_DIR / "metrics.json"
    with open(metrics_path, "w", encoding="utf-8") as f:
        json.dump(report, f, indent=2)
    print(f"Saved metrics to {metrics_path}")

if __name__ == "__main__":
    main()
