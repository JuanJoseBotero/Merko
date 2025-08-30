from django.core.management.base import BaseCommand
from catalog.models import Prompt, Category
import json
import os

class Command(BaseCommand):
    help = 'Load prompts from prompts.json into the Prompt model'

    def handle(self, *args, **kwargs):
        json_file_path = 'catalog/management/commands/prompts.json'

        if not os.path.exists(json_file_path):
            self.stdout.write(self.style.ERROR(f"File {json_file_path} not found"))
            return

        with open(json_file_path, 'r', encoding="utf-8") as file:
            prompts = json.load(file)

        for prompt in prompts:
            title = prompt.get('title')
            description = prompt.get('description', '')
            category_name = prompt.get('category')
            prompt_template = prompt.get('prompt_template')
            variables = prompt.get('variables', [])

            # Buscar categoría si existe
            category = None
            if category_name:
                category, _ = Category.objects.get_or_create(name=category_name)

            # Verificar si ya existe
            exists = Prompt.objects.filter(
                title=title,
                prompt_template=prompt_template
            ).first()

            if not exists:
                Prompt.objects.create(
                    title=title,
                    description=description,
                    category=category,
                    prompt_template=prompt_template,
                    variables=variables,
                )
                self.stdout.write(self.style.SUCCESS(f"Added prompt: {title}"))
            else:
                self.stdout.write(self.style.WARNING(f"Prompt already exists: {title}"))
