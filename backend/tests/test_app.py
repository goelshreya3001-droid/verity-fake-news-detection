import pytest
import sys, os
# Add parent directory (backend) to path for imports
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))

from fastapi.testclient import TestClient
from pathlib import Path

from backend.app import app

client = TestClient(app)

def test_chandrayaan_landing_override():
    payload = {
        "headline": "Chandrayaan-3 successfully soft-landed on the Moon on Aug",
        "article": "ISRO's Chandrayaan-3 mission successfully landed on the Moon on August 23, 2023. The mission includes the Vikram lander and Pragyan rover."
    }
    response = client.post("/predict", json=payload)
    assert response.status_code == 200
    data = response.json()
    assert data["label"] == "Real"
    assert data["prediction"] == 1

def test_unrelated_chandrayaan_fake():
    payload = {
        "headline": "Chandrayaan-3 mission faces delays due to technical issues",
        "article": "The Indian space agency announced that the Chandrayaan-3 launch may be postponed after recent tests showed failures."
    }
    response = client.post("/predict", json=payload)
    assert response.status_code == 200
    data = response.json()
    # Expect the model to label this as Fake (or at least not Real)
    assert data["label"] != "Real"
    # Ensure prediction field is present and is an int
    assert isinstance(data["prediction"], int)

import sys, os
# Add parent directory (backend) to path for imports
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))

from fastapi.testclient import TestClient
from pathlib import Path

from backend.app import app

client = TestClient(app)

def test_chandrayaan_landing_override():
    payload = {
        "headline": "Chandrayaan-3 successfully soft-landed on the Moon on Aug",
        "article": "ISRO's Chandrayaan-3 mission successfully landed on the Moon on August 23, 2023. The mission includes the Vikram lander and Pragyan rover."
    }
    response = client.post("/predict", json=payload)
    assert response.status_code == 200
    data = response.json()
    assert data["label"] == "Real"
    assert data["prediction"] == 1



def test_chandrayaan_exact_input():
    payload = {
        "headline": "Chandrayaan-3 successfully soft-landed on the Moon on Aug",
        "article": "ISRO's Chandrayaan-3 mission successfully landed on the Moon on August 23, 2023. The mission included the Vikram lander and Pragyan rover."
    }
    response = client.post("/predict", json=payload)
    assert response.status_code == 200
    data = response.json()
    assert data["label"] == "Real"
    assert data["prediction"] == 1

    payload = {
        "headline": "Chandrayaan-3 mission faces delays due to technical issues",
        "article": "The Indian space agency announced that the Chandrayaan-3 launch may be postponed after recent tests showed failures."
    }
    response = client.post("/predict", json=payload)
    assert response.status_code == 200
    data = response.json()
    # Expect the model to label this as Fake (or at least not Real)
    assert data["label"] != "Real"
    # Ensure prediction field is present and is an int
    assert isinstance(data["prediction"], int)
