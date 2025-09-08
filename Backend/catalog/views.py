from rest_framework import generics, viewsets
from .models import Prompt, Category
from .serializers import PromptSerializer, CategorySerializer


# Read-only, connects to the category serializer to display all categories statically.
class CategoryViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = Category.objects.all()
    serializer_class = CategorySerializer


# Use the serializer for prompts
class PromptListAPIView(generics.ListAPIView):
    serializer_class = PromptSerializer

    def get_queryset(self):
        # Get all prompts and filter them by category
        queryset = Prompt.objects.all()
        category_id = self.request.query_params.get("category", None)
        if category_id:
            queryset = queryset.filter(category_id=category_id)
        return queryset


# El retrieve permite solo ver un objeto por id, asi al momento de editar solo
# se pueda hacer por el id
class PromptDetailAPIView(generics.RetrieveAPIView):
    queryset = Prompt.objects.all()
    serializer_class = PromptSerializer
