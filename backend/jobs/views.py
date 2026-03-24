from rest_framework import status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework.response import Response
from django.db.models import Q
from .models import Job
from .serializers import JobListSerializer, JobDetailSerializer, JobCreateUpdateSerializer


@api_view(['GET'])
@permission_classes([AllowAny])
def job_list(request):
    """
    GET /api/jobs/
    Query params: title, location, job_type, category, salary_min, page
    """
    qs = Job.objects.filter(is_active=True).select_related('company', 'company__company_profile')

    # Search filters
    title    = request.query_params.get('title', '').strip()
    location = request.query_params.get('location', '').strip()
    job_type = request.query_params.get('job_type', '').strip()
    category = request.query_params.get('category', '').strip()
    salary_min = request.query_params.get('salary_min')

    if title:
        qs = qs.filter(Q(title__icontains=title) | Q(description__icontains=title))
    if location:
        qs = qs.filter(location__icontains=location)
    if job_type:
        qs = qs.filter(job_type=job_type)
    if category:
        qs = qs.filter(category=category)
    if salary_min:
        try:
            qs = qs.filter(salary_min__gte=int(salary_min))
        except ValueError:
            pass

    # Pagination
    from django.core.paginator import Paginator
    page_num  = int(request.query_params.get('page', 1))
    page_size = int(request.query_params.get('page_size', 10))
    paginator = Paginator(qs, page_size)
    page      = paginator.get_page(page_num)

    serializer = JobListSerializer(page.object_list, many=True)
    return Response({
        'count':    paginator.count,
        'pages':    paginator.num_pages,
        'current':  page_num,
        'next':     page.has_next(),
        'previous': page.has_previous(),
        'results':  serializer.data,
    })


@api_view(['GET'])
@permission_classes([AllowAny])
def job_detail(request, pk):
    """GET /api/jobs/<id>/"""
    try:
        job = Job.objects.select_related('company', 'company__company_profile').get(pk=pk, is_active=True)
    except Job.DoesNotExist:
        return Response({'error': 'Job not found.'}, status=status.HTTP_404_NOT_FOUND)

    serializer = JobDetailSerializer(job)
    return Response(serializer.data)


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def job_create(request):
    """POST /api/jobs/ — company only"""
    if not request.user.is_company:
        return Response({'error': 'Only company accounts can post jobs.'}, status=status.HTTP_403_FORBIDDEN)

    serializer = JobCreateUpdateSerializer(data=request.data, context={'request': request})
    if serializer.is_valid():
        job = serializer.save()
        return Response(JobDetailSerializer(job).data, status=status.HTTP_201_CREATED)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(['PUT', 'PATCH', 'DELETE'])
@permission_classes([IsAuthenticated])
def job_update_delete(request, pk):
    """PUT/PATCH/DELETE /api/jobs/<id>/ — owner company only"""
    try:
        job = Job.objects.get(pk=pk)
    except Job.DoesNotExist:
        return Response({'error': 'Job not found.'}, status=status.HTTP_404_NOT_FOUND)

    # Only the company that posted can edit/delete
    if job.company != request.user:
        return Response({'error': 'You do not have permission to modify this job.'}, status=status.HTTP_403_FORBIDDEN)

    if request.method == 'DELETE':
        job.delete()
        return Response({'message': 'Job deleted successfully.'}, status=status.HTTP_204_NO_CONTENT)

    partial = request.method == 'PATCH'
    serializer = JobCreateUpdateSerializer(job, data=request.data, partial=partial, context={'request': request})
    if serializer.is_valid():
        job = serializer.save()
        return Response(JobDetailSerializer(job).data)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def company_jobs(request):
    """GET /api/jobs/mine/ — list jobs posted by the authenticated company"""
    if not request.user.is_company:
        return Response({'error': 'Only company accounts can access this endpoint.'}, status=status.HTTP_403_FORBIDDEN)

    jobs = Job.objects.filter(company=request.user).order_by('-created_at')
    serializer = JobDetailSerializer(jobs, many=True)
    return Response({'results': serializer.data, 'count': jobs.count()})
