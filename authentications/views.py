from drf_yasg.utils import swagger_auto_schema
from rest_framework.response import Response
from django.contrib.auth import authenticate
from django.contrib.auth.models import User
from datetime import datetime, timedelta
from rest_framework.views import APIView
from rest_framework import status
from utils import JWTTokenizer
from drf_yasg import openapi
from . import serializers


class Index(APIView):
    """ Hi forks, Welcome to Backend API! """

    def get(self, args):
        data = {'context': "Hi forks, Welcome to Backend API", 'status': status.HTTP_200_OK}
        return Response(data)


class UserSignUp(APIView):
    @swagger_auto_schema(
        request_body=openapi.Schema(
            type=openapi.TYPE_OBJECT,
            properties={
                'username': openapi.Schema(type=openapi.TYPE_STRING, description='User username.'),
                'email': openapi.Schema(type=openapi.TYPE_STRING, description='User email.'),
                'password': openapi.Schema(type=openapi.TYPE_STRING, description='User password.'),
            },
            required=['email', 'password']
        ),
        responses={
            status.HTTP_200_OK: openapi.Response(
                description="Successfully logged in.",
                schema=openapi.Schema(
                    type=openapi.TYPE_OBJECT,
                    properties={
                        'detail': openapi.Schema(type=openapi.TYPE_STRING, description='Login success message.'),
                    }
                )
            ),
            status.HTTP_400_BAD_REQUEST: openapi.Response(description="Bad request."),
        }
    )
    def post(self, request, format=None):
        serializer = serializers.SignupSerializer(data=request.data)
        print(serializer.is_valid())
        if serializer.is_valid():
            username = serializer.validated_data['username']
            email = serializer.validated_data['email']
            password = serializer.validated_data['password']
            print(username, email, password)
            if User.objects.filter(username=username).exists():
                return Response({'error': 'Username already exists'}, status=status.HTTP_400_BAD_REQUEST)
            User.objects.create_user(username=username,
                                     email=email,
                                     password=password)
            return Response({'detail': 'User created successfully', "success": True}, status=status.HTTP_201_CREATED)
        else:
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class UserSignIn(APIView):
    @swagger_auto_schema(
        request_body=openapi.Schema(
            type=openapi.TYPE_OBJECT,
            properties={
                'username': openapi.Schema(type=openapi.TYPE_STRING, description='User email.'),
                'password': openapi.Schema(type=openapi.TYPE_STRING, description='User password.'),
            },
            required=['email', 'password']
        ),
        responses={
            status.HTTP_200_OK: openapi.Response(
                description="Successfully logged in.",
                schema=openapi.Schema(
                    type=openapi.TYPE_OBJECT,
                    properties={
                        'detail': openapi.Schema(type=openapi.TYPE_STRING, description='Login success message.'),
                        'name': openapi.Schema(type=openapi.TYPE_STRING, description='User name.'),
                        'email': openapi.Schema(type=openapi.TYPE_STRING, description='User email.'),
                        'role': openapi.Schema(type=openapi.TYPE_STRING, description='User role.'),
                        'access_token': openapi.Schema(type=openapi.TYPE_STRING, description='JWT access token.'),
                    }
                )
            ),
            status.HTTP_400_BAD_REQUEST: openapi.Response(description="Bad request."),
        }
    )
    def post(self, request, format=None):
        serializer = serializers.LoginSerializer(data=request.data)
        if serializer.is_valid():
            username = serializer.validated_data['username']
            password = serializer.validated_data['password']
            user = authenticate(username=username, password=password)
            if user:
                user_info = {"user_id": user.id, "email": user.email, "exp": datetime.utcnow() + timedelta(minutes=45)}
                token = JWTTokenizer._encode(user_info)
                return Response({
                    "success": True,
                    'detail': 'Login successful',
                    'access_token': str(token),
                    "expires_at": str(datetime.utcnow() + timedelta(minutes=45)),
                }, status=status.HTTP_200_OK)
            else:
                return Response({'detail': 'Invalid username or password',
                                 "success": False}, status=status.HTTP_401_UNAUTHORIZED)
        else:
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
