import pytest
from rest_framework.test import APIClient
from django.urls import reverse

@pytest.mark.django_db
def test_get_prompts_by_category():
    client = APIClient()
    # http://127.0.0.1:8000/api/catalog/prompts/?category=2
    url = reverse('prompt-list')
    response = client.get(url, {'category': 2})
    assert response.status_code == 200
    data = response.json()
    assert isinstance(data, list)
    assert all('prompt_template' in prompt for prompt in data)

