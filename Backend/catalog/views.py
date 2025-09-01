from rest_framework import generics, status, viewsets
from rest_framework.views import APIView
from rest_framework.response import Response
from .models import Prompt, Category
from .serializers import PromptSerializer, CategorySerializer

class CategoryViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = Category.objects.all()
    serializer_class = CategorySerializer

class PromptListAPIView(generics.ListAPIView):
    serializer_class = PromptSerializer
    def get_queryset(self):
        queryset = Prompt.objects.all()
        category_id = self.request.query_params.get("category", None)
        if category_id:
            queryset = queryset.filter(category_id=category_id)
        return queryset

class PromptDetailAPIView(generics.RetrieveAPIView):
    queryset = Prompt.objects.all()
    serializer_class = PromptSerializer

class RunAnalysisAPIView(APIView):
    def post(self, request):
        prompt = request.data.get("prompt")
        params = request.data.get("params", {})

        result = f"Running analysis with: {prompt}, params: {params}"

        return Response({"result": result}, status=status.HTTP_200_OK)