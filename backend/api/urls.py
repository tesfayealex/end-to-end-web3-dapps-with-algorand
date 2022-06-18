from django.urls import path
from .views import IndexAPI, get_user_detail ,get_request_list,send_certificate_request,create_new_nft, get_all_user_a_wallet,optin_to_asset,get_asset_info ,hello_world ,connect_to_algo

urlpatterns = [
    path('', IndexAPI.as_view()),
    path('get_user_detail' , get_user_detail),
    path('get_request_list', get_request_list),
    path('send_certificate_request', send_certificate_request),
    path('user', get_all_user_a_wallet),
    path('create_new_nft', create_new_nft),
    path('optin_to_asset', optin_to_asset),
    path('get_asset_info', get_asset_info),
    path('connect', connect_to_algo),
    # path('user', get_all_user_a_wallet),
    # path('create_new_nft', create_new_nft),
]
