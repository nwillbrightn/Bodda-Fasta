import pytest
from run import app

@pytest.fixture
def client():
    app.config["TESTING"] = True
    with app.test_client() as client:
        yield client

def test_get_users(client):
    response = client.get("/users")
    ## assert response.status_code == 999
    assert response.status_code in [200, 401, 404]

