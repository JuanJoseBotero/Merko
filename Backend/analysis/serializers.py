from rest_framework import serializers
from .models import Dashboard



# The class fields are passed so that they can be converted to JSON to
# be consumed by the API.
class DashboardSerializer(serializers.ModelSerializer):
    class Meta:
        model = Dashboard
        fields = [
            "id",
            "name",
            "date",
            "diagrams",
            "api_information",
        ]
