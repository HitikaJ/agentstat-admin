from django.conf import settings
from django.conf.urls.static import static
from django.contrib import admin
from django.urls import path

from backend import views

urlpatterns = [
    # path('admin/', admin.site.urls),
    path('', views.dashboard),

] + static(settings.STATIC_URL, document_root=settings.STATIC_ROOT) + static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
