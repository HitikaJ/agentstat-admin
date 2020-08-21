from django.conf import settings
from django.conf.urls.static import static
from django.contrib import admin
from django.urls import path

from backend import views

urlpatterns = [
    # path('admin/', admin.site.urls),
    path('', views.dashboard),
    path('search-log/', views.search_log),
    path('referrals/', views.referrals),
    path('agent-profiles/', views.agent_profile),
    path('messages/', views.messages),
    path('admin/', views.admin),

] + static(settings.STATIC_URL, document_root=settings.STATIC_ROOT) + static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
