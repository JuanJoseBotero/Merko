import pytest
from rest_framework.test import APIClient
from django.urls import reverse
from catalog.models import Prompt
from types import SimpleNamespace

@pytest.mark.django_db
def test_send_prompt_success(mocker):
    client = APIClient()
    url = reverse('request-information-agent')

    prompt = Prompt.objects.create(
        title = 'Prompt template title',
        output_format = 'Output format in which the response is requested from OpenAI.'
    )

    request_data = {
        'title': 'Prompt template title',
        'prompt': 'Prompt edited by the user.'
    }

    mock_response = SimpleNamespace(
        choices=[
            SimpleNamespace(
                message=SimpleNamespace(
                    content='{"response": "OpenAI response."}'
                )
            )
        ]
    )

    mocker.patch('analysis.views.client.chat.completions.create', return_value=mock_response)

    response = client.post(url, request_data, format='json')

    assert response.status_code == 200
    data = response.json()
    assert 'result' in data
    assert data['result']['response'] == "OpenAI response."

@pytest.mark.django_db
def test_send_empty_prompt(mocker):
    client = APIClient()
    url = reverse('request-information-agent')

    Prompt.objects.create(
        title = 'Prompt template title',
        output_format = 'Output format in which the response is requested from OpenAI.'
    )

    request_data = {
        'title': 'Prompt template title',
        'prompt': ''  
    }

    response = client.post(url, request_data, format='json')

    assert response.status_code == 400
    data = response.json()
    assert data['result'] == 'A prompt with empty parameters was sent'

