from django.urls import path
from .views import (
    CategoryViewSet,
    PromptListAPIView,
    PromptDetailAPIView,
)

urlpatterns = [
    path("categories/", CategoryViewSet.as_view({"get": "list"}), name="category-list"),
    path("prompts/", PromptListAPIView.as_view(), name="prompt-list"),
    # The prompt id=pk is edited with the parameterizable variables.
    path("prompts/<int:pk>/", PromptDetailAPIView.as_view(), name="prompt-detail"),
]
