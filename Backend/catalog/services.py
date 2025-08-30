import os
import json
from openai import OpenAI
from dotenv import load_dotenv
from catalog.models import Prompt
from catalog.services import PromptService

class PromptAIService:
    def __init__(self):
        load_dotenv(".env")
        api_key = os.getenv("openai_apikey")
        self.client = OpenAI(api_key=api_key)

    def run_prompt(self, prompt_id: int, parameters: dict):
        try:
            prompt = Prompt.objects.get(id=prompt_id)
        except Prompt.DoesNotExist:
            return {"error": "Prompt not found"}

        # Renderizar con parámetros
        rendered_prompt = PromptService.render_message(prompt.prompt_template, parameters)

        msg = [{"role": "user", "content": rendered_prompt}]
        response = self.client.chat.completions.create(
            model="gpt-4o-mini",
            messages=msg,
            max_tokens=1500
        )

        return {
            "prompt": rendered_prompt,
            "response": response.choices[0].message.content
        }



