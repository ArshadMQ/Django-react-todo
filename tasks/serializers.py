from rest_framework import serializers
from .models import Task


class TaskSerializer(serializers.ModelSerializer):
    class Meta:
        model = Task
        fields = ['id', 'title', 'description', 'status', 'user_id', 'created_at', 'updated_at']


class TaskUpdateSerializer(serializers.ModelSerializer):
    class Meta:
        model = Task
        fields = ['title', 'description', 'status']


class TaskDeleteSerializer(serializers.ModelSerializer):
    class Meta:
        model = Task
        fields = []
