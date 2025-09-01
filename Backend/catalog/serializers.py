from rest_framework import serializers
from .models import Prompt, Category

class CategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = Category
        fields = ["id", "name", "description"]

class PromptSerializer(serializers.ModelSerializer):
    class Meta:
        model = Prompt
        fields = ["id", "title", "description", "category", "prompt_template", "variables", "created_at"]
