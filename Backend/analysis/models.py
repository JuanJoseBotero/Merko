from django.db import models
from account.models import User

class Dashboard(models.Model):
    name = models.CharField(max_length=100)
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name="dashboards")
    prompt_response = models.JSONField()

    def __str__(self):
        return self.name
