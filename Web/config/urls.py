from django.contrib import admin
from django.urls import path, include
from django.conf.urls.static import static
from django.conf import settings

urlpatterns = [
    path('admin/', admin.site.urls),
    path('site_admin/', include('site_admin.urls')),
    
    path('api/', include('api.urls')),

    path('api-auth/', include('rest_framework.urls')), # API 화면에 Log In/Out 표시
] + static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)