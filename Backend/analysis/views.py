from django.shortcuts import render
import os
import json
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from openai import OpenAI
from dotenv import load_dotenv

load_dotenv()
client = OpenAI(api_key=os.environ.get("OPENAI_API_KEY"))

def request_information_for_agent(prompt: str, prompt_params: dict)->dict:

    system_message = {
        "role": "system",
        "content": "You are a professional market analyst. Your primary goal is to provide accurate and truthful information based on a factual understanding of the data. You must be honest about any limitations in the data. Your response must be a single, valid JSON object that strictly adheres to the requested format. Do not include any additional text or formatting outside of the JSON."
    }

    formatted_prompt = prompt.format(**prompt_params)

    chat_completion = client.chat.completions.create(
        model="gpt-4o-mini",
        messages=[
            system_message,
            {"role": "user", "content": formatted_prompt},
        ],
        response_format={"type": "json_object"},
        temperature=0.3,
    )
    api_response_content = chat_completion.choices[0].message.content
    parsed_json_response = json.loads(api_response_content)

    return parsed_json_response


## ------- EXAMPLE --------
prompt_template = """Analyze the market for {product_category} and provide a detailed breakdown
of the top {top_X_number} major importers over the last {time_period}. For each importer, identify the specific product 
types they import within the category {category} The metric to use is {metric}."""

prompt_parameters = {
    "product_category": "glass containers",
    "top_X_number": "5",
    "time_period": "6 months",
    "category": "glass containers for beverages",
    "metric": "value in USD"
}


print("Sending request to OpenAI API...")

try:
    response = request_information_for_agent(prompt_template, prompt_parameters)
    print("Request successful! Here is the JSON response:")
    print(json.dumps(response, indent=2))
except Exception as e:
    print(f"An error occurred: {e}")




