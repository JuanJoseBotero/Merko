import pytest
from django.urls import reverse
from rest_framework.test import APIClient
from account.models import User
from django.contrib.auth.hashers import make_password

@pytest.mark.django_db
def test_user_login_success():
    user = User.objects.create(
        username="vbenitezz22",
        email="vbenitezz22@eafit.edu.co",
        password=make_password("1033486609")
    )

    client = APIClient()
    url = reverse('login')
    payload = {"username": "vbenitezz22", "password": "1033486609"}

    response = client.post(url, payload, format='json')

    assert response.status_code == 200
    data = response.json()

    assert "access" in data
    assert "refresh" in data
    assert data["username"] == "vbenitezz22"
