from django.urls import path
from . import views

urlpatterns = [
    path('jobs/',        views.job_list,          name='job-list'),
    path('jobs/mine/',   views.company_jobs,       name='company-jobs'),
    path('jobs/<int:pk>/', views.job_detail,       name='job-detail'),
    path('jobs/create/', views.job_create,         name='job-create'),
    path('jobs/<int:pk>/manage/', views.job_update_delete, name='job-manage'),
]
