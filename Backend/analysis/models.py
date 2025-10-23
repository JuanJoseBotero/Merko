from django.db import models
from account.models import User


class Dashboard(models.Model):
    name = models.CharField(max_length=100)
    date = models.DateTimeField(auto_now_add=True)
    diagrams = models.JSONField(blank=True, null=True, default=dict)
    api_information = models.JSONField(blank=True, null=True, default=dict)
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name="dashboards")

    def __str__(self):
        return self.name
