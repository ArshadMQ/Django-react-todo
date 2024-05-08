from django.urls import path, include, re_path
from django.conf.urls.static import static
from drf_yasg.views import get_schema_view
from rest_framework import permissions
from django.contrib import admin
from drf_yasg import openapi
from pathlib import Path

schema_view = get_schema_view(
    openapi.Info(
        title="Django Assessment API",
        default_version='v1',
        description="Welcome to the world of tasks management",
        terms_of_service="https://www.example.com",
        contact=openapi.Contact(email="admin@gmail.com"),
        license=openapi.License(name="Example.com"),
    ),
    public=True,
    permission_classes=[permissions.AllowAny, ],
)

urlpatterns = [
    re_path(r'^docs(?P<format>\.json|\.yaml)$', schema_view.without_ui(cache_timeout=0), name='schema-json'),
    path('docs/', schema_view.with_ui('swagger', cache_timeout=0), name='schema-swagger-ui'),
    path("admin-login/", admin.site.urls),
    path("api/v1/accounts/", include("authentications.urls")),
    path("api/v1/task/", include("tasks.urls")),
]

urlpatterns += static('/api/v1/', document_root=str(Path(__file__).resolve().parent.parent) + f"/static/school_logos/")
