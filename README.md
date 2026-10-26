FAKE-NEWS-DETECTION
===================

A full‑stack web application that detects fake news articles using a simple NLP pipeline.

## Project layout

```
fake-news-detection/
├─ backend/
│  ├─ app.py                 # FastAPI server
│  ├─ train_model.py         # Script to train / evaluate the model
│  ├─ requirements.txt       # Python dependencies
│  ├─ artifacts/             # Trained model & metrics (generated after training)
│  └─ tests/
│     └─ test_app.py         # Basic API tests
├─ frontend/
│  ├─ index.html
│  ├─ vite.config.js
│  ├─ package.json
│  └─ src/
│     ├─ main.jsx
│     ├─ App.jsx
│     ├─ styles.css
│     ├─ components/
│     │   ├─ Navbar.jsx
│     │   ├─ AnalyzeForm.jsx
│     │   ├─ PredictionCard.jsx
│     │   └─ Metrics.jsx
│     └─ services/
│         └─ api.js          # Wrapper for backend calls
├─ datasets/                  # Put **Fake.csv** and **True.csv** here
│   └─ .gitkeep
├─ .gitignore
└─ README.md
```

## How to get started (Windows PowerShell)

```powershell
# 1. Clone / navigate to the project folder
cd C:\Users\asus\OneDrive\Desktop\fraud_news\fake-news-detection

# 2. -------- Backend --------
#   a. Create a virtual environment
python -m venv .venv
#   b. Activate it
.\.venv\Scripts\Activate.ps1
#   c. Install Python dependencies
pip install -r backend\requirements.txt

#   d. Place the datasets (Fake.csv, True.csv) in the datasets folder
#      └─ datasets\Fake.csv
#      └─ datasets\True.csv

#   e. Train the model (once the CSVs are present)
python backend\train_model.py

#   f. Start the FastAPI server
uvicorn backend.app:app --reload --port 8000
```

```powershell
# 3. -------- Frontend (React + Vite) --------
#   a. Open a new PowerShell window and navigate again
cd C:\Users\asus\OneDrive\Desktop\fraud_news\fake-news-detection

#   b. Install Node dependencies
npm install --prefix frontend

#   c. Run the development server
npm run dev --prefix frontend
```

The React dev server will start at `http://localhost:5173` and proxy API calls to the FastAPI backend (`http://localhost:8000`).

## Training & evaluation

Running `backend\train_model.py` will:
1. Load the CSV files from `datasets/`.
2. Perform basic cleaning, combine title + article text, and label rows (Fake = 0, Real = 1).
3. Split the data into train/validation/test sets (80/10/10).
4. Build a TF‑IDF → classifier pipeline (Logistic Regression, Multinomial NB, LinearSVC).
5. Pick the best model based on validation F1‑score.
6. Save the fitted pipeline to `backend/artifacts/model.joblib`.
7. Write evaluation metrics to `backend/artifacts/metrics.json`.

The FastAPI server lazily loads the model on first request; if the model file is missing it returns a clear error.

## Responsible use

> This tool **does not** perform live fact‑checking. It merely classifies text based on patterns learned from the supplied training data and may produce inaccurate results on unseen domains. Use the predictions as a *suggestion* only, not as a definitive truth.

---

Feel free to open issues or modify the UI – the code is intentionally simple and well‑documented for learning and placement interview purposes.
