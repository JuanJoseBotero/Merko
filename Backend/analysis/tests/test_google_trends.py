import pytest
from unittest.mock import patch, MagicMock
from pytrends.exceptions import TooManyRequestsError
from analysis.views import get_additional_data
import pandas as pd


@pytest.mark.django_db
def test_get_additional_data_success(monkeypatch):
    # Crear un DataFrame simulado con un índice tipo datetime
    mock_df = pd.DataFrame(
        {"Leonisa": [10, 20], "Textile industry": [5, 15]},
        index=pd.to_datetime(["2023-01-01", "2023-01-02"])
    )

    mock_pytrends = MagicMock()
    mock_pytrends.interest_over_time.return_value = mock_df

    # Mock de TrendReq
    with patch("analysis.views.TrendReq", return_value=mock_pytrends):
        variables = {
            "distributor_name": "Leonisa",
            "country": "Colombia",
            "industry": "Textile industry"
        }
        result = get_additional_data(4, variables)

        assert "Interest over time for Leonisa" in result
        assert "Interest over time for Textile industry" in result
        assert isinstance(result, str)


@pytest.mark.django_db
def test_get_additional_data_too_many_requests(monkeypatch):
    with patch("analysis.views.TrendReq") as mock_trendreq:
        mock_instance = mock_trendreq.return_value
        # Corregido: TooManyRequestsError requiere dos parámetros
        mock_instance.build_payload.side_effect = TooManyRequestsError("Too many requests", response=None)

        variables = {
            "distributor_name": "Leonisa",
            "country": "Colombia",
            "industry": "Textile industry"
        }

        result = get_additional_data(4, variables)

        # Cuando ocurre TooManyRequestsError, get_additional_data devuelve cadena vacía
        assert result == ""

