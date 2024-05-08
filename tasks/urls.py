from django.urls import path
from . import views

urlpatterns = [
    path('list/', views.TaskListAPIView.as_view(), name='task-list'),
    path('list_filter/', views.TaskListByFilterAPIView.as_view(), name='task-list-by-filter'),
    path('<int:pk>/', views.TaskDetailAPIView.as_view(), name='task-detail'),
    path('create/', views.TaskCreateAPIView.as_view(), name='task-create'),
    path('update/<int:pk>/', views.TaskUpdateAPIView.as_view(), name='task-update'),
    path('delete/<int:pk>/', views.TaskDeleteAPIView.as_view(), name='task-delete'),
]
