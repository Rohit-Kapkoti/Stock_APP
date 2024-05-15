from django.shortcuts import render
from api.models import User, Watchlist
from rest_framework import serializers
from rest_framework_simplejwt.tokens import RefreshToken
from django.contrib.auth import authenticate
from rest_framework.decorators import permission_classes
from rest_framework.permissions import IsAuthenticated


def get_tokens_for_user(user):
    refresh = RefreshToken.for_user(user)
    return {
        'refresh': str(refresh),
        'access': str(refresh.access_token),
    }

class UserRegistrationSerializer(serializers.Serializer):
    password = serializers.CharField(style={"input_type":'password'},write_only=True)
    name = serializers.CharField(max_length=50)
    email = serializers.EmailField(max_length =55)
                                        
    class Meta:
        model = User
        fields = ["email", "name","password"]
        extra_kwrags={
            "password" :{"write_only":True}
        }
    def create(self, validated_data):
        print(validated_data)
        user = User.objects.create_user(**validated_data)
        return user
    
# Login
class UserLoginSerializer(serializers.Serializer):
    email = serializers.EmailField(max_length=150)
    password = serializers.CharField(max_length=128, write_only=True)  
    def validate(self, attrs):
        email = attrs.get('email')
        password = attrs.get('password')
        user = authenticate(email=email,password=password)
        if user is not None:
                token = get_tokens_for_user(user)
                return {'email': user.email,'name':user.name,"token":token}
        else:
                raise serializers.ValidationError({'error': 'Invalid email or password'})

class UserProfileSerializer(serializers.ModelSerializer):
    permission_classes =[IsAuthenticated]
    class Meta:
          model = User
          fields =["name","email","id"]
    
    
class UserWatchlistSerializer(serializers.ModelSerializer):
    class Meta:
        model = Watchlist
        fields = ['id', 'symbol']

class UserSerializer(serializers.ModelSerializer):
    watchlist = UserWatchlistSerializer(many=True, read_only=True)

    class Meta:
        model = User
        fields = ['id', 'name', 'watchlist']
