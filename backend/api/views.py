from django.shortcuts import render
from rest_framework.response import Response
from rest_framework.views import APIView
from api.models import Profile
from django.contrib.auth.models import User
from rest_framework.decorators import api_view
# Create your views here.
from time import time, sleep

from algosdk import account, encoding
from algosdk.logic import get_application_address
# from api.auction.operations import createAuctionApp, setupAuctionApp, placeBid, closeAuction
# from api.auction.util import (
#     getBalances,
#     getAppGlobalState,
#     getLastBlockTimestamp,
# )
# from api.auction.testing.setup import getAlgodClient
# from api.auction.testing.resources import (
#     getTemporaryAccount,
#     optInToAsset,
#     createDummyAsset,
# )
from .helper import getAlgodClient,getKmdClient,getGenesisAccounts,getTemporaryAccount,createDummyAsset,optInToAsset

client = getAlgodClient()

class IndexAPI(APIView):
    def get(self, request):
        return Response({"message": "HELLO WORLD!"})


@api_view()
def hello_world(request):
    return Response({"message": "HELLO WORLD! FROM FUNCTION"})

@api_view()
def connect_to_algo(request):
    # client = getAlgodClient()
    creator = getTemporaryAccount(client)
    print(creator.getAddress())
    print(client)
    return Response({"message": "Connected To Algo"})

@api_view()
def get_all_user_a_wallet(request):
    # print("*******************")
    # user_list = User.objects.all()
    list = Profile.objects.all()[0]
    
    print(list)
    print(list.user.is_staff)
    list.address = None
    if list.address is None or not list.address :
        # print("*******************")
        creator = getTemporaryAccount(client)
        list.address = creator.getAddress()
        list.private_key = creator.getPrivateKey()
        list.save()
    # print(user_list)
    # client = getAlgodClient()

    # print(client)
    return Response({"message": "all users have a wallet" , "user_address": list.address})

@api_view()
def create_new_nft(request):
    # client = getAlgodClient()
    # print(client)
    list = Profile.objects.all()[0]
    
    print(list)
    print(list.user.is_staff)
    nftAmount = 1
    ftID = None
    if list.user.is_staff == True:
        account_info = client.account_info(list.address)
        print("**********account**************")
        print(list.private_key)
        ftID = createDummyAsset(client, nftAmount, list.address , list.private_key, 'trainee1')
        list.certificate_id = ftID
        list.save()
    return Response({"message": "minted a new nft" , 'nft_id' : ftID})

@api_view()
def optin_to_asset(request):
    list = Profile.objects.all()[0]
    if list.user.is_staff == True:
        print(list.certificate_id)
        optInToAsset(client, list.certificate_id, list.a)
    return Response({"message": "optin_to_asset"})

@api_view()
def get_all_user(request):
    client = getAlgodClient()
    print(client)
    return Response({"message": "get_all_user"})

# @api_view()
# def get_all_user_a_wallet(request):
#     client = getAlgodClient()
#     print(client)
#     return Response({"message": "all users have a wallet"})
