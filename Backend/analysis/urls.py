from django.urls import path
from .views import request_information_agent, save_dashboard, DashboardListAPIView

urlpatterns = [
    path("request-information-agent/",request_information_agent,name="request-information-agent",),
    path("save-dashboard/",save_dashboard,name="save-dashboard",),
    path("dashboards/",DashboardListAPIView.as_view(),name="dashboard",),


]
