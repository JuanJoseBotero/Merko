from django.contrib import admin
from .models import Prompt, Category

admin.site.register(Category)
admin.site.register(Prompt)
# Register your models here.
