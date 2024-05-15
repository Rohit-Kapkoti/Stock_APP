from django.shortcuts import render
from rest_framework.response import Response 
from rest_framework import status
from rest_framework.views import APIView 
from rest_framework.decorators import api_view
from api.serializers import UserRegistrationSerializer,UserLoginSerializer,UserProfileSerializer,UserSerializer
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework.decorators import permission_classes
from rest_framework.permissions import IsAuthenticated
from api.models import Watchlist
import requests
from django.conf import settings

def get_tokens_for_user(user):
    refresh = RefreshToken.for_user(user)
    return {
        'refresh': str(refresh),
        'access': str(refresh.access_token),
    }

# Create your views here.
@api_view(["POST"])
def register(request):
    serializer = UserRegistrationSerializer(data=request.data)
    if serializer.is_valid(raise_exception=True):
        user = serializer.save()
        token = get_tokens_for_user(user)
        return Response({"token":token},status=status.HTTP_201_CREATED)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(["POST"])
def login(request):
    serializer = UserLoginSerializer(data=request.data)
    if serializer.is_valid():
        return Response(serializer.validated_data,status=status.HTTP_200_OK)
    return Response(serializer.errors, status=status.HTTP_401_UNAUTHORIZED)

@api_view(['GET'])
def profile(request):
    serializer = UserProfileSerializer(request.user)
    return Response(serializer.data, status=status.HTTP_200_OK)


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def watchlist(request):
    user = request.user
    serializer = UserSerializer(user)
    return Response(serializer.data, status=status.HTTP_200_OK)

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def add_to_watchlist(request):
    user = request.user
    symbol = request.data.get('symbol')
    if not symbol:
        return Response({"error": "Symbol is required"}, status=status.HTTP_400_BAD_REQUEST)
    
    watchlist_item, created = Watchlist.objects.get_or_create(user=user, symbol=symbol)
    if created:
        return Response({"message": "Symbol added to watchlist"}, status=status.HTTP_201_CREATED)
    return Response({"message": "Symbol already in watchlist"}, status=status.HTTP_200_OK)

@api_view(['DELETE'])
@permission_classes([IsAuthenticated])
def remove_from_watchlist(request, symbol):
    user = request.user
    try:
        watchlist_item = Watchlist.objects.get(user=user, symbol=symbol)
        watchlist_item.delete()
        return Response({"message": "Symbol removed from watchlist"}, status=status.HTTP_200_OK)
    except Watchlist.DoesNotExist:
        return Response({"error": "Symbol not in watchlist"}, status=status.HTTP_400_BAD_REQUEST)
        
@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_watchlist_stock_data(request):
    user = request.user
    watchlist_items = user.watchlist.all()
    stock_data = []

    api_key = settings.API_KEY
    print(api_key)

    for item in watchlist_items:
        symbol = item.symbol
        url = f'https://www.alphavantage.co/query?function=TIME_SERIES_INTRADAY&symbol={symbol}&interval=5min&apikey={api_key}'
        response = requests.get(url)
        data = response.json()
        print(data)
        if 'Time Series (5min)' in data:
            time_series = data['Time Series (5min)']
            latest_timestamp = next(iter(time_series))
            latest_data = time_series[latest_timestamp]
            stock_data.append({
                'symbol': symbol,
                'timestamp': latest_timestamp,
                'data': latest_data
            })

    return Response(stock_data, status=status.HTTP_200_OK)