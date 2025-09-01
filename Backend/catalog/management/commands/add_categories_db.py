from django.core.management.base import BaseCommand
from catalog.models import Category
import json
import os

class Command(BaseCommand):
    help = 'Load categories from categories.json into the Prompt model'

    def handle(self, *args, **kwargs):
        json_file_path = 'catalog/management/commands/categories.json'

        if not os.path.exists(json_file_path):
            self.stdout.write(self.style.ERROR(f"File {json_file_path} not found"))
            return

        with open(json_file_path, 'r', encoding="utf-8") as file:
            categories = json.load(file)

        for category in categories:
            name = category.get('name')
            description = category.get('description', '')


            # Verificar si ya existe
            exists = Category.objects.filter(
                name=name,
            ).first()

            if not exists:
                Category.objects.create(
                    name=name,
                    description=description,
                )
                self.stdout.write(self.style.SUCCESS(f"Added category: {name}"))
            else:
                self.stdout.write(self.style.WARNING(f"Category already exists: {name}"))