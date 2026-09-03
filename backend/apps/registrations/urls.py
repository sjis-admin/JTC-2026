from django.urls import path
from . import views
from . import payment_views

urlpatterns = [
    path('schools/', views.school_list, name='school-list'),
    path('settings/', views.site_settings_public, name='site-settings-public'),
    path('registrations/', views.RegistrationCreateView.as_view(), name='registration-create'),
    path('registrations/<str:code>/', views.registration_lookup, name='registration-lookup'),
    
    # SSLCommerz Payment Gateway Endpoints
    path('payments/sslcommerz/initiate/<str:code>/', payment_views.sslcommerz_initiate, name='sslcommerz-initiate'),
    path('payments/sslcommerz/success/', payment_views.sslcommerz_success, name='sslcommerz-success'),
    path('payments/sslcommerz/fail/', payment_views.sslcommerz_fail, name='sslcommerz-fail'),
    path('payments/sslcommerz/cancel/', payment_views.sslcommerz_cancel, name='sslcommerz-cancel'),
    path('payments/sslcommerz/ipn/', payment_views.sslcommerz_ipn, name='sslcommerz-ipn'),

    # Admin
    path('admin/registrations/export/excel/', views.admin_export_excel, name='admin-registrations-export-excel'),
    path('admin/registrations/', views.admin_registrations_list, name='admin-registrations'),
    path('admin/registrations/<str:pk>/payment/', views.admin_update_payment, name='admin-payment-update'),
    path('admin/registrations/<str:pk>/update_payment/', views.admin_update_payment, name='admin-payment-update-alt'),
    path('admin/stats/', views.admin_dashboard_stats, name='admin-stats'),
]
