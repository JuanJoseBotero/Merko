from rest_framework import serializers
from .models import Prompt, Category


# The class fields are passed so that they can be converted to JSON to
# be consumed by the API.
class CategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = Category
        fields = ["id", "name", "description"]


# The class fields are passed so that they can be converted to JSON to
# be consumed by the API.
class PromptSerializer(serializers.ModelSerializer):
    class Meta:
        model = Prompt
        fields = [
            "id",
            "title",
            "description",
            "category",
            "prompt_template",
            "variables",
            "created_at",
        ]
