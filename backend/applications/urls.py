from django.urls import path
from . import views

urlpatterns = [
    path('jobs/<int:pk>/apply/', views.apply_for_job, name='apply_for_job'),
    path('applications/', views.my_applications, name='my_applications'),
    path('jobs/<int:pk>/applicants/', views.job_applicants, name='job_applicants'),
    path('applications/<int:pk>/', views.update_application_status, name='update_application_status'),
]