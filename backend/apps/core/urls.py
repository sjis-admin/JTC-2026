from django.urls import path
from . import views

urlpatterns = [
    path('settings/', views.site_settings_admin, name='admin-site-settings'),
    path('schools/', views.SchoolListCreateView.as_view(), name='admin-schools'),
    path('schools/<int:pk>/', views.SchoolDetailView.as_view(), name='admin-school-detail'),
]
