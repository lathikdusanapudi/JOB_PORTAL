from rest_framework import status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from django.shortcuts import get_object_or_404
from jobs.models import Job
from .models import Application
from .serializers import (
    ApplicationSerializer, 
    ApplicationCreateSerializer, 
    ApplicantDetailSerializer,
    StatusUpdateSerializer
)

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def apply_for_job(request, pk):
    """POST /api/jobs/<id>/apply/"""
    if not request.user.is_applicant:
        return Response({'error': 'Only applicants can apply for jobs.'}, status=status.HTTP_403_FORBIDDEN)
        
    job = get_object_or_404(Job, pk=pk)
    
    serializer = ApplicationCreateSerializer(data=request.data, context={'request': request, 'job': job})
    if serializer.is_valid():
        application = serializer.save()
        return Response(ApplicationSerializer(application).data, status=status.HTTP_201_CREATED)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def my_applications(request):
    """GET /api/applications/"""
    if not request.user.is_applicant:
        return Response({'error': 'Only applicants can view their applications.'}, status=status.HTTP_403_FORBIDDEN)
        
    apps = Application.objects.filter(applicant=request.user).select_related('job', 'job__company', 'job__company__company_profile')
    serializer = ApplicationSerializer(apps, many=True)
    return Response({'results': serializer.data, 'count': apps.count()})

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def job_applicants(request, pk):
    """GET /api/jobs/<id>/applicants/"""
    if not request.user.is_company:
        return Response({'error': 'Only company accounts can view applicants.'}, status=status.HTTP_403_FORBIDDEN)
        
    job = get_object_or_404(Job, pk=pk)
    if job.company != request.user:
        return Response({'error': 'You do not have permission to view this job.'}, status=status.HTTP_403_FORBIDDEN)
        
    apps = Application.objects.filter(job=job).select_related('applicant', 'applicant__applicant_profile')
    serializer = ApplicantDetailSerializer(apps, many=True)
    return Response({'results': serializer.data, 'count': apps.count()})

@api_view(['PATCH'])
@permission_classes([IsAuthenticated])
def update_application_status(request, pk):
    """PATCH /api/applications/<id>/"""
    if not request.user.is_company:
        return Response({'error': 'Only company accounts can update status.'}, status=status.HTTP_403_FORBIDDEN)
        
    app = get_object_or_404(Application, pk=pk)
    if app.job.company != request.user:
        return Response({'error': 'You do not have permission to modify this application.'}, status=status.HTTP_403_FORBIDDEN)
        
    serializer = StatusUpdateSerializer(app, data=request.data, partial=True)
    if serializer.is_valid():
        serializer.save()
        return Response(ApplicantDetailSerializer(app).data)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)