from django.core.management.base import BaseCommand
from catalog.models import Category
import json
import os


class Command(BaseCommand):
    # Message for the terminal
    help = "Load categories from categories.json into the Prompt model"

    def handle(self, *args, **kwargs):
        json_file_path = "catalog/management/commands/categories.json"

        if not os.path.exists(json_file_path):
            self.stdout.write(self.style.ERROR(f"File {json_file_path} not found"))
            return

        with open(json_file_path, "r", encoding="utf-8") as file:
            categories = json.load(file)

        for category in categories:
            name = category.get("name")
            description = category.get("description", "")

            # Check if it already exists
            exists = Category.objects.filter(
                name=name,
            ).first()

            # If they do not exist, create them in the category class.
            if not exists:
                Category.objects.create(
                    name=name,
                    description=description,
                )
                # Terminal msg
                self.stdout.write(self.style.SUCCESS(f"Added category: {name}"))
            else:
                # Terminal msg
                self.stdout.write(
                    self.style.WARNING(f"Category already exists: {name}")
                )
