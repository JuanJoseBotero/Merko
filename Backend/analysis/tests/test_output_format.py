import json
import pytest
from rest_framework.test import APIClient
from catalog.models import Prompt

@pytest.mark.django_db
def test_output_format_for_nivo_radar():
    ai_response = json.dumps([
        {
            "type_of_chart": "Radar",
            "chart_data": [
                {"product_type": "Imported fruits", "importer_1": 40, "importer_2": 55},
                {"product_type": "National fruits", "importer_1": 60, "importer_2": 50}
            ]
        }
    ])

    try:
        parsed = json.loads(ai_response)
    except json.JSONDecodeError:
        pytest.fail("The AI response is not valid JSON")

    first_obj = parsed[0]
    assert "type_of_chart" in first_obj, "Missing key: type_of_chart"
    assert first_obj["type_of_chart"] == "Radar", "Chart type must be Radar"
    assert "chart_data" in first_obj, "Missing key: chart_data"

    chart_data = first_obj["chart_data"]
    assert isinstance(chart_data, list), "chart_data must be a list"
    assert len(chart_data) > 0, "chart_data must not be empty"

    first_entry = chart_data[0]
    assert "product_type" in first_entry, "Each entry must include 'product_type'"

    numeric_fields = {k: v for k, v in first_entry.items() if k != "product_type"}
    for key, value in numeric_fields.items():
        assert isinstance(value, (int, float)), f"'{key}' must be numeric"

    index_key = "product_type"
    keys = [k for k in chart_data[0].keys() if k != index_key]

    for entry in chart_data:
        for key in keys:
            assert key in entry, f"Missing key '{key}' in chart_data entry"
            assert isinstance(entry[key], (int, float)), f"'{key}' must be numeric"
        assert index_key in entry, "Each entry must include index key 'product_type'"


