from django.shortcuts import render
from rest_framework.response import Response
from rest_framework.views import APIView
from api.models import Profile, CertificateRequests
from django.contrib.auth.models import User 
from rest_framework.authtoken.models import Token
from rest_framework.decorators import api_view,permission_classes
# Create your views here.
from time import time, sleep
from datetime import datetime
from rest_framework.permissions import AllowAny, IsAuthenticated
from algosdk import account, encoding
from algosdk.logic import get_application_address

from .helper import getAlgodClient,getKmdClient,getGenesisAccounts,getTemporaryAccount,createAsset,optInToAsset

client = getAlgodClient()

def returnUsersObjFromToken(token):
    user = Token.objects.get(key=token[1])
    users = Profile.objects.filter(user=user.user)
    if users.exists():
        users = users.first()
        print(users)
        # setExpired(users)
        return users
    return None

class IndexAPI(APIView):
    def get(self, request):
        return Response({"message": "HELLO WORLD!"})


@api_view()
def hello_world(request):
    return Response({"message": "HELLO WORLD! FROM FUNCTION"})

@api_view()
@permission_classes((AllowAny,))
def connect_to_algo(request):
    # client = getAlgodClient()
    creator = getTemporaryAccount(client)
    print(creator.getAddress())
    print(client)
    return Response({"message": "Connected To Algo"})

@api_view(["POST"])
@permission_classes((IsAuthenticated,))
def get_user_detail(request):
    users = returnUsersObjFromToken(str(request.META.get('HTTP_AUTHORIZATION')).split(" "))
    certificate_list = CertificateRequests.objects.all().filter(user=users.user)
    asset = {}
    print(client)
    if users.certificate_id != "":
        try:
            asset = client.account_asset_info(address= users.address , asset_id=users.certificate_id)
        except:
            print("error")
    return Response({"is_staff": users.user.is_staff , "certificate_list" : len(certificate_list) , "certificate_ready": users.certificate_id  , "claimed": users.claimed, "asset" : asset})

@api_view()
@permission_classes((IsAuthenticated,))
def get_request_list(request):
    users = returnUsersObjFromToken(str(request.META.get('HTTP_AUTHORIZATION')).split(" "))
    if users.user.is_staff == True:
        certificate_list = CertificateRequests.objects.all().filter()
        requesters = []
        for c in certificate_list:
            profile = Profile.objects.all().filter(user=c.user)
            profile = profile.first()
            print(profile.certificate_id)
            print(c.user.is_staff)
            print(c.user.username)
            if profile.certificate_id == "" and c.user.is_staff != True:
                requesters.append({"first_name": c.user.first_name , "last_name": c.user.last_name , "user_id": c.user.id})
        return Response({"requesters": requesters})
    else:
        return Response({"requesters": []})

@api_view()
@permission_classes((IsAuthenticated,))
def send_certificate_request(request):
    users = returnUsersObjFromToken(str(request.META.get('HTTP_AUTHORIZATION')).split(" "))
    certificate_list = CertificateRequests.objects.all().filter(user=users.user)
    if len(certificate_list) == 0:
        CertificateRequests.objects.create(
            user =  users.user,
            date =  datetime.now()
        )
    else:
        return Response({"success": False , "message": "Already sent a request"})
    return Response({"success": True , "message": "Certificate Request has been successfully sent"})

@api_view()
@permission_classes((AllowAny,))
def get_all_user_a_wallet(request):
    #
    user_list = Profile.objects.all().filter()

    for list in user_list:
     
        if list.address is None or not list.address :
            # print("*******************")
            creator = getTemporaryAccount(client)
            list.address = creator.getAddress()
            list.private_key = creator.getPrivateKey()
            list.save()
    
    return Response({"message": "all users have a wallet" , "user_address": list.address})



@api_view(["POST"])
def create_new_nft(request):
    users = returnUsersObjFromToken(str(request.META.get('HTTP_AUTHORIZATION')).split(" "))
    user = User.objects.all().filter(id=request.data['user_id'])[0]
    list = Profile.objects.all().filter(user=user.id).first()

    print(list)
    print(list.user.is_staff)
    nftAmount = 1
    ftID = None
    if users.user.is_staff == True:
        account_info = client.account_info(list.address)
        print("**********account**************")
        print(list.private_key)
        url = request.data['url']
        if url != '':
            ftID = createAsset(client, url,nftAmount, list.address , list.private_key, 'trainee1')
            list.certificate_id = ftID
            list.claimed = False
            list.save()
        else:
            return Response({"success": False , "message": "Url was not provided"})
    else:
        return Response({"success": False , "message": "You are not staff"})

    return Response({"success": True ,"message": "minted a new nft" , 'nft_id' : ftID})

@api_view()
def optin_to_asset(request):
    users = returnUsersObjFromToken(str(request.META.get('HTTP_AUTHORIZATION')).split(" "))
    if users.user.is_staff == False:
        print(users.certificate_id)
        optInToAsset(client,users.private_key , users.certificate_id, users.address)
        users.claimed = True

    asset = client.account_asset_info(address= users.address  , asset_id=users.certificate_id)
    return Response({"message": "asset successfully claimed", "asset_info":asset})

@api_view(["POST"])
@permission_classes((AllowAny,))
def get_asset_info(request):
    
    users = returnUsersObjFromToken(str(request.META.get('HTTP_AUTHORIZATION')).split(" "))
    asset = client.account_asset_info(address= users.address , asset_id=request.data['asset_id'])
   
    return Response({"message": "optin_to_asset", "asset_info":asset})

@api_view()
def get_all_user(request):
    client = getAlgodClient()
    print(client)
    return Response({"message": "get_all_user"})


