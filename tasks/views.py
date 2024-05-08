from drf_yasg.utils import swagger_auto_schema
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework import status
from utils import JWTTokenizer
from datetime import datetime
from drf_yasg import openapi
from .models import Task
from . import serializers
import jwt


class TaskListByFilterAPIView(APIView):
    @swagger_auto_schema(
        operation_id='List_Task By Filter',
        operation_summary='List all tasks by filter',
        manual_parameters=[
            openapi.Parameter('Authorization', openapi.IN_HEADER, type=openapi.TYPE_STRING,
                              description='Bearer token for authentication.', required=True),
            openapi.Parameter('status', openapi.IN_QUERY, type=openapi.TYPE_STRING,
                              description='Filter users by status', enum=['To Do', 'In Progress', 'Done'])
        ],
        responses={
            status.HTTP_200_OK: openapi.Response(description="List of users"),
            status.HTTP_401_UNAUTHORIZED: openapi.Response(description="Unauthorized"),
        }
    )
    def get(self, request):
        access_token = request.headers.get('Authorization')
        status = request.query_params.get('status')
        try:
            decoded_token = JWTTokenizer._decode(access_token)
        except jwt.exceptions.ExpiredSignatureError:
            return Response(status=status.HTTP_401_UNAUTHORIZED)
        except jwt.exceptions.InvalidSignatureError:
            return Response(status=status.HTTP_401_UNAUTHORIZED)
        tasks = Task.objects.filter(status=status, user_id=decoded_token["user_id"]).order_by('-created_at')
        serializer = serializers.TaskSerializer(tasks, many=True)
        return Response({"success": True, "tasks": serializer.data})


class TaskListAPIView(APIView):
    @swagger_auto_schema(
        operation_id='List_Users',
        operation_summary='List all users',
        manual_parameters=[
            openapi.Parameter('Authorization', openapi.IN_HEADER, type=openapi.TYPE_STRING,
                              description='Bearer token for authentication.', required=True),
        ],
        responses={
            status.HTTP_200_OK: openapi.Response(description="List of users"),
            status.HTTP_401_UNAUTHORIZED: openapi.Response(description="Unauthorized"),
        }
    )
    def get(self, request):
        access_token = request.headers.get('Authorization')
        try:
            decoded_token = JWTTokenizer._decode(access_token)
        except jwt.exceptions.ExpiredSignatureError:
            return Response(status=status.HTTP_401_UNAUTHORIZED)
        except jwt.exceptions.InvalidSignatureError:
            return Response(status=status.HTTP_401_UNAUTHORIZED)

        tasks = Task.objects.filter(user_id=decoded_token["user_id"]).order_by('-created_at')
        serializer = serializers.TaskSerializer(tasks, many=True)
        return Response({"success": True, "tasks": serializer.data})


class TaskCreateAPIView(APIView):
    @swagger_auto_schema(
        request_body=openapi.Schema(
            type=openapi.TYPE_OBJECT,

            properties={
                'title': openapi.Schema(type=openapi.TYPE_STRING, description='User title.'),
                'description': openapi.Schema(type=openapi.TYPE_STRING, description='User description.'),
            },
            required=['title', 'description']
        ),
        manual_parameters=[
            openapi.Parameter('Authorization', openapi.IN_HEADER, type=openapi.TYPE_STRING,
                              description='Bearer token for authentication.', required=True),
        ],
        responses={
            status.HTTP_200_OK: openapi.Response(
                description="Successfully created",
                schema=openapi.Schema(
                    type=openapi.TYPE_OBJECT,
                    properties={
                        'detail': openapi.Schema(type=openapi.TYPE_STRING, description='Task created!'),
                    }
                )
            ),
            status.HTTP_400_BAD_REQUEST: openapi.Response(description="Bad request."),
        }
    )
    def post(self, request):
        access_token = request.headers.get('Authorization')
        try:
            decoded_token = JWTTokenizer._decode(access_token)
        except jwt.exceptions.ExpiredSignatureError:
            return Response({"detail": "Please login"}, status=status.HTTP_401_UNAUTHORIZED)
        except jwt.exceptions.InvalidSignatureError:
            return Response({"detail": "Please login"}, status=status.HTTP_401_UNAUTHORIZED)

        title = request.data['title']
        desc = request.data['description']
        task = {"title": title, "description": desc,
                "user_id": decoded_token["user_id"], 'status': 'To Do',
                "created_at": datetime.utcnow, "updated_at": datetime.utcnow()}

        serializer = serializers.TaskSerializer(data=task)
        if serializer.is_valid():
            serializer.save()
            return Response({
                "success": True,
                'detail': 'Task created!',
                'data': serializer.data,
            }, status=status.HTTP_201_CREATED)
        return Response({"detail": serializer.errors}, status=status.HTTP_400_BAD_REQUEST)


class TaskDetailAPIView(APIView):
    @swagger_auto_schema(
        operation_id='List_Users',
        operation_summary='List all users',
        manual_parameters=[
            openapi.Parameter('Authorization', openapi.IN_HEADER, type=openapi.TYPE_STRING,
                              description='Bearer token for authentication.', required=True),
        ],
        responses={
            status.HTTP_200_OK: openapi.Response(description="List of users"),
            status.HTTP_401_UNAUTHORIZED: openapi.Response(description="Unauthorized"),
        }
    )
    def get(self, request, pk):
        access_token = request.headers.get('Authorization')
        try:
            decoded_token = JWTTokenizer._decode(access_token)
        except jwt.exceptions.ExpiredSignatureError:
            return Response(status=status.HTTP_401_UNAUTHORIZED)
        except jwt.exceptions.InvalidSignatureError:
            return Response(status=status.HTTP_401_UNAUTHORIZED)
        tasks = Task.objects.filter(pk=pk, user_id=decoded_token["user_id"])
        serializer = serializers.TaskSerializer(tasks, many=True)
        return Response(serializer.data)


class TaskUpdateAPIView(APIView):
    @swagger_auto_schema(
        request_body=openapi.Schema(
            type=openapi.TYPE_OBJECT,

            properties={
                'title': openapi.Schema(type=openapi.TYPE_STRING, description='User title.'),
                'description': openapi.Schema(type=openapi.TYPE_STRING, description='User description.'),
                'status': openapi.Schema(type=openapi.TYPE_STRING, description='status.'),
            },
            required=['title', 'description']
        ),
        manual_parameters=[
            openapi.Parameter('Authorization', openapi.IN_HEADER, type=openapi.TYPE_STRING,
                              description='Bearer token for authentication.', required=True),
        ],
        responses={
            status.HTTP_200_OK: openapi.Response(
                description="Successfully created",
                schema=openapi.Schema(
                    type=openapi.TYPE_OBJECT,
                    properties={
                        'detail': openapi.Schema(type=openapi.TYPE_STRING, description='Task created!'),
                    }
                )
            ),
            status.HTTP_400_BAD_REQUEST: openapi.Response(description="Bad request."),
        }
    )
    def put(self, request, pk):
        task = self.get_task(pk)
        if not task:
            return Response("task does not found", status=status.HTTP_400_BAD_REQUEST)

        serializer = serializers.TaskUpdateSerializer(task, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def get_task(self, pk):
        try:
            return Task.objects.get(pk=pk)
        except Task.DoesNotExist:
            return None


class TaskDeleteAPIView(APIView):
    @swagger_auto_schema(
        operation_id='Delete Task',
        operation_summary='Delete task by id',
        manual_parameters=[
            openapi.Parameter('Authorization', openapi.IN_HEADER, type=openapi.TYPE_STRING,
                              description='Bearer token for authentication.', required=True),
        ],
        responses={
            status.HTTP_200_OK: openapi.Response(description="Successfully deleted"),
            status.HTTP_401_UNAUTHORIZED: openapi.Response(description="Unauthorized"),
            status.HTTP_404_NOT_FOUND: openapi.Response(description="Task not found"),
        }
    )
    def delete(self, request, pk):
        print(pk)
        task = self.get_task(pk)
        if task:
            task.delete()
            return Response({"success": True, "detail": "Task Deleted Successfully!"}, status=status.HTTP_200_OK)
        return Response({"success": True, "detail": "Task not found"}, status=status.HTTP_404_NOT_FOUND)

    def get_task(self, pk):
        try:
            return Task.objects.get(pk=pk)
        except Task.DoesNotExist:
            return None
