from django.urls import path
from . import views

app_name = "site_admin"

urlpatterns = [
    path("", views.MainView.as_view(), name="main"),
    path("statistics/", views.StatisticsView.as_view(), name="statistics"),
    path("liveCam/", views.liveCamView.as_view(), name="liveCam"),
    path("setting/", views.SettingView.as_view(), name="setting"),
    path("detail/", views.DetailView.as_view(), name="detail"),
    
    path("test/", views.TestView.as_view(), name="test"),   
]