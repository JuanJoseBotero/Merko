from django.urls import path
from .views import PromptDetailAPIView, PromptPreviewAPIView

urlpatterns = [
    path("prompts/<int:pk>/", PromptDetailAPIView.as_view(), name="prompt-detail"),
    path("prompts/preview/", PromptPreviewAPIView.as_view(), name="prompt-preview"),
]
