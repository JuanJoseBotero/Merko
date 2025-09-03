from django.urls import path
from .views import request_information_agent

urlpatterns = [
    path("request-information-agent/", request_information_agent, name="request-information-agent"),
]
