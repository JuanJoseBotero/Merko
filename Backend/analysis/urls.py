from django.urls import path
from .views import request_information_agent, CurrentDashboardView, search_hs_view, save_dashboard, DashboardListAPIView

urlpatterns = [
    path("request-information-agent/",request_information_agent,name="request-information-agent",),
    path("save-dashboard/",save_dashboard,name="save-dashboard",),
    path("dashboards/",DashboardListAPIView.as_view(),name="dashboard",),
    path("current-dashboard-view/", CurrentDashboardView.as_view(), name="current-dashboard-view"),
    path("search-hs/", search_hs_view, name="search-hs"),


]
