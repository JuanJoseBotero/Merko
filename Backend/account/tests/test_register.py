import pytest
from django.urls import reverse
from rest_framework.test import APIClient
from account.models import User
from django.contrib.auth.hashers import check_password

@pytest.mark.django_db
def test_user_register_success():
    client = APIClient()
    url = reverse('register')
    payload = {
        "username": "vbenitezz22",
        "email": "vbenitezz22@eafit.edu.co",
        "password": "1033486609"
    }

    response = client.post(url, payload, format='json')

    assert response.status_code == 201
    assert User.objects.count() == 1

    user = User.objects.get(username="vbenitezz22")
    assert check_password("1033486609", user.password)