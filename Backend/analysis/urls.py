from django.urls import path
from .views import request_information_agent, save_dashboard

urlpatterns = [
    path("request-information-agent/",request_information_agent,name="request-information-agent",),
    path("save-dashboard/",save_dashboard,name="save-dashboard",),

]
