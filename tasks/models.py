from django.db import models
from django.contrib.auth.models import User
from datetime import datetime


class Task(models.Model):
    STATUS_CHOICES = (
        ('To Do', 'To Do'),
        ('In Progress', 'In Progress'),
        ('Done', 'Done'),
    )

    title = models.CharField(max_length=100)
    description = models.TextField()
    status = models.CharField(max_length=20, choices=STATUS_CHOICES)
    user_id = models.ForeignKey(User, on_delete=models.CASCADE)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.title
