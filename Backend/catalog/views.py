from django.shortcuts import render
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.decorators import api_view
from rest_framework import status
from .models import Prompt
from .serializers import PromptSerializer
from catalog.services import PromptService

@api_view(["GET"])
def get_prompts(request):
    prompts = Prompt.objects.all()
    serializer = PromptSerializer(prompts, many=True)
    return Response(serializer.data)

class PromptDetailAPIView(APIView):
    def get(self, request, pk):
        try:
            prompt = Prompt.objects.get(pk=pk)
            serializer = PromptSerializer(prompt)
            return Response(serializer.data, status=status.HTTP_200_OK)
        except Prompt.DoesNotExist:
            return Response({"error": "Prompt not found"}, status=status.HTTP_404_NOT_FOUND)

class PromptPreviewAPIView(APIView):
    def post(self, request):
        prompt_id = request.data.get("prompt_id")
        parameters = request.data.get("parameters", {})

        try:
            prompt = Prompt.objects.get(id=prompt_id)
            preview = PromptService.render_message(prompt.prompt_template, parameters)
            return Response({
                "prompt_id": prompt.id,
                "preview": preview
            }, status=status.HTTP_200_OK)
        except Prompt.DoesNotExist:
            return Response({"error": "Prompt not found"}, status=status.HTTP_404_NOT_FOUND)
