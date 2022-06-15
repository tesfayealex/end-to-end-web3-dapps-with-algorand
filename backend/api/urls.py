from django.urls import path
from .views import IndexAPI

urlpatterns = [
    path('', IndexAPI.as_view())
]
