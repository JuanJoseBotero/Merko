from django.urls import path
from .views import CategoryViewSet,PromptListAPIView, PromptDetailAPIView, RunAnalysisAPIView

urlpatterns = [
    path("categories/", CategoryViewSet.as_view({'get': 'list'}), name="category-list"),
    path("prompts/", PromptListAPIView.as_view(), name="prompt-list"),
    path("prompts/<int:pk>/", PromptDetailAPIView.as_view(), name="prompt-detail"),
    path("run-analysis/", RunAnalysisAPIView.as_view(), name="run-analysis"),
]