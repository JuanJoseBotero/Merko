from django.core.management.base import BaseCommand
from catalog.models import Prompt, Category
import json
import os


class Command(BaseCommand):
    help = "Load prompts from prompts.json into the Prompt model"

    def handle(self, *args, **kwargs):
        json_file_path = "catalog/management/commands/prompts.json"

        if not os.path.exists(json_file_path):
            self.stdout.write(self.style.ERROR(f"File {json_file_path} not found"))
            return

        with open(json_file_path, "r", encoding="utf-8") as file:
            prompts = json.load(file)

        for prompt in prompts:
            title = prompt.get("title")
            description = prompt.get("description", "")
            category_name = prompt.get("category")
            prompt_template = prompt.get("prompt_template")
            output_format = prompt.get("output_format")
            variables = prompt.get("variables", {})

            # Search category if it exists
            if category_name:
                category = Category.objects.filter(name=category_name).first()

                # If it does not exist, it does not allow the prompt to be created.
                if not category:
                    self.stdout.write(
                        self.style.WARNING(
                            "There is not a category called: "
                            f"{category_name}, please create one."
                        )
                    )

            # Check if it already exists
            exists = Prompt.objects.filter(
                title=title,
            ).first()

            # Create it if it does not exist
            if not exists and category:
                Prompt.objects.create(
                    title=title,
                    description=description,
                    category=category,
                    prompt_template=prompt_template,
                    output_format=output_format,
                    variables=variables,
                )
                self.stdout.write(self.style.SUCCESS(f"Added prompt: {title}"))
            else:
                self.stdout.write(self.style.WARNING(f"Prompt already exists: {title}"))
