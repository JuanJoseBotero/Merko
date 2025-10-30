import os
import json
from openai import OpenAI
from dotenv import load_dotenv
from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status
from catalog.models import Prompt
from .models import Dashboard
from account.models import User

import unicodedata
import time
from pytrends.request import TrendReq
from pytrends.exceptions import TooManyRequestsError



load_dotenv()
client = OpenAI(api_key=os.environ.get("OPENAI_API_KEY"))


def normalize_country(country: str) -> str:
    return ''.join(
        c for c in unicodedata.normalize("NFD", country.lower())
        if unicodedata.category(c) != 'Mn'
    )

def get_geo(country: str) -> str:
    country_dict = {
        "colombia": "CO",
        "mexico": "MX",
        "chile": "CL",
        "brazil": "BR",
        "peru": "PE",
        "argentina": "AR",
        "ecuador": "EC",
        "usa": "US",
        "united states": "US",
        "spain": "ES",
        "canada": "CA",
        "germany": "DE",
        "france": "FR",
        "italy": "IT",
        "united kingdom": "GB",
        "uk": "GB",
        "australia": "AU",
        "india": "IN",
        "japan": "JP",
    }

    normalized = normalize_country(country)
    code = country_dict.get(normalized, "CO")
    return code

def get_additional_data(prompt_id: int, variables: dict) -> str:
    if prompt_id >= 4 and prompt_id <= 6:
        distributor_name = variables.get("distributor_name", "")
        country = variables.get("country", "")
        industry = variables.get("industry", "")

        geo = get_geo(country)
        pytrends = TrendReq(hl='en-US', tz=360)

        data = ""
        try: 
            match prompt_id:
                case 4:
                    # Interés por una compañía e industria
                    time.sleep(3)
                    keywords = [distributor_name, industry]
                    pytrends.build_payload(kw_list=keywords, geo=geo)
                    interest_over_time = pytrends.interest_over_time()
                    interest_over_time.index = interest_over_time.index.astype(str)
                    distributor_name_trend = interest_over_time[[distributor_name]].to_dict()
                    industry_trend = interest_over_time[[industry]].to_dict()
                    data = (
                        f"Interest over time for {distributor_name}: "
                        f"{json.dumps(distributor_name_trend, default=str)}\n\n"
                        f"Interest over time for {industry}: "
                        f"{json.dumps(industry_trend, default=str)}"
                    )

                case 5:
                    # Segmentos de mercado en la industria
                    time.sleep(3)
                    keywords = [industry]
                    pytrends.build_payload(kw_list=keywords, geo=geo)
                    related_topics = pytrends.related_topics()

                    market_segments = related_topics.get(industry, {}).get("top", None)
                    if market_segments is not None:
                        top_5 = market_segments.head(5)[["topic_title", "topic_type"]].to_dict(orient="records")
                        data = (
                            f"Potential market segments in {industry} for {country} based on search trends: "
                            f"{json.dumps(top_5, ensure_ascii=False)}"
                        )
                case 6:
                    # Segmentos de clientes en la industria
                    time.sleep(3)
                    keywords = [industry]
                    pytrends.build_payload(kw_list=keywords, geo=geo)
                    related_queries = pytrends.related_queries()
                    related_topics = pytrends.related_topics()
                    top_queries = related_queries.get(industry, {}).get("top", None)
                    top_topics = related_topics.get(industry, {}).get("top", None)
                    customer_segments = []
                    if top_queries is not None:
                        top_query_list = top_queries.head(5)["query"].tolist()
                        customer_segments.extend(
                            {"segment_source": "query", "term": q} for q in top_query_list
                        )
                    if top_topics is not None:
                        top_topic_list = top_topics.head(5)[["topic_title", "topic_type"]].to_dict(orient="records")
                        customer_segments.extend(
                            {
                                "segment_source": "topic",
                                "term": t["topic_title"],
                                "type": t["topic_type"]
                            }
                            for t in top_topic_list
                        )
                    if customer_segments:
                        data = (
                            f"Identified potential customer segments in the {industry} industry in {country}: "
                            f"{json.dumps(customer_segments, ensure_ascii=False)}"
                        )
                # case 7: Productos importados y productos nacionales en la industria
        except TooManyRequestsError:
            print("TooManyRequestsError")
            data = ""
        print(f"🔍 Trends info for prompt {prompt_id}:\n{data}\n")
        return data
                

@api_view(["POST"])
def request_information_agent(request) -> Response:
    system_message = {
        "role": "system",
        "content": "You are a professional market analyst. Your primary goal "
        "is to provide accurate and truthful information based on a factual "
        "understanding of the data. You must be honest about any limitations "
        "in the data. Your response must be a single, valid JSON object that "
        "strictly adheres to the requested format. Do not include any "
        "additional text or formatting outside of the JSON.",
    }
    prompt = Prompt.objects.filter(title=request.data.get("title")).first()
    formatted_prompt = request.data.get("prompt")

    if not formatted_prompt or not prompt:
        return Response({"result": "Invalid prompt."}, status=400)

    complete_prompt = f'{formatted_prompt} \n {prompt.output_format}'

    chat_completion = client.chat.completions.create(
        model="gpt-4o-mini",
        messages=[system_message, {"role": "user", "content": complete_prompt}],
        response_format={"type": "json_object"},
        temperature=0.3,
    )
    response_content = chat_completion.choices[0].message.content
    parsed_json_response = json.loads(response_content)

    print(f"COMPLETE PROMPT: {complete_prompt}")
    print(f"RESPONSE: {response_content}")

    return Response({"result": parsed_json_response}, status=200)

@api_view(["POST"])
def save_dashboard(request):

    user = User.objects.filter(username=request.data.get("username")).first()
    print(f"USERNAME: {request.data.get("username")}")
    print(f"USUARIO: {user.username}")
    dashboard_name = request.data.get("dashboard_name")
    diagrams = request.data.get("diagrams")
    used_prompts = request.data.get("usedPrompts")


    if not dashboard_name or not diagrams:
        return Response({"error": "Missing dashboard_name or diagrams"}, status=400)

    dashboard = Dashboard.objects.create(
        name=dashboard_name,
        diagrams=diagrams,
        api_information="none",
        user=user,
    )

    return Response({"dashboard_id": dashboard.id,"dashboard_name":dashboard_name, "used_prompts":used_prompts, "date":dashboard.date,"dashboard_diagrams":diagrams, "source":"Open AI", "message": "Dashboard saved"}, status=201)
