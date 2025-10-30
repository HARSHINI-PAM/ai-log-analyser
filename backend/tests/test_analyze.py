from fastapi.testclient import TestClient
from backend.main import app

client = TestClient(app)

def test_analyze_route():
    payload = {"logs": ["error happened", "Database timeout", "WARNING: slow query"]}
    response = client.post("/analyze", json=payload)
    assert response.status_code == 200
    data = response.json()
    # Accept both 'root_cause' and 'root_cause_category' keys for robustness
    assert (
        'root_cause' in data or 'root_cause_category' in data
    ), f"Response is missing cause field: {data}"
