import pytest
from rest_framework.test import APIClient
from django.urls import reverse

@pytest.mark.django_db
def test_get_categories():
    client = APIClient()
    # http://127.0.0.1:8000/api/catalog/categories/
    url = reverse('category-list')
    response = client.get(url)
    assert response.status_code == 200
    assert isinstance(response.json(), list)