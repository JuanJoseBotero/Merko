from django.shortcuts import render
import os
import json
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from openai import OpenAI
from dotenv import load_dotenv
from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import generics, status, viewsets
from catalog.models import Prompt
from django.conf import settings

client = OpenAI(api_key=settings.OPENAI_API_KEY)

@api_view(["POST"])
def request_information_agent(request)->Response:

    system_message = {
        "role": "system",
        "content": "You are a professional market analyst. Your primary goal is to provide accurate and truthful information based on a factual understanding of the data. You must be honest about any limitations in the data. Your response must be a single, valid JSON object that strictly adheres to the requested format. Do not include any additional text or formatting outside of the JSON."
    }
    prompt = Prompt.objects.filter(title=request.data.get("title")).first()
    formatted_prompt = request.data.get("prompt") 

    if not formatted_prompt:
        return Response({"result":"A prompt with empty parameters was sent"},status=status.HTTP_400_BAD_REQUEST)
    
    complete_prompt = formatted_prompt + "\n" + prompt.output_format

    print(f'COMPLETE PROMPT:\n{complete_prompt}')

    chat_completion = client.chat.completions.create(
        model="gpt-4o-mini",
        messages=[
            system_message,
            {"role": "user", "content": complete_prompt},
        ],
        response_format={"type": "json_object"},
        temperature=0.3,
    )
    response_content = chat_completion.choices[0].message.content
    parsed_json_response = json.loads(response_content)
    print(f'Response:\n{parsed_json_response}')
    
    return Response({"result":parsed_json_response},status=status.HTTP_200_OK)


