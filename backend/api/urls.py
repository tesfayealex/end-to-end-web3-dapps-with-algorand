from django.urls import path
from .views import IndexAPI, create_new_nft, get_all_user_a_wallet, hello_world ,connect_to_algo

urlpatterns = [
    path('', IndexAPI.as_view()),
    path('func', hello_world),
    path('connect', connect_to_algo),
    path('user', get_all_user_a_wallet),
    path('create_nft', create_new_nft)
]
