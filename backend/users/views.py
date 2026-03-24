from rest_framework import status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.response import Response
from .serializers import RegisterSerializer, LoginSerializer, UserSerializer, get_tokens_for_user


@api_view(['POST'])
@permission_classes([AllowAny])
def register(request):
    """Register a new user (applicant or company)"""
    serializer = RegisterSerializer(data=request.data)
    if serializer.is_valid():
        user = serializer.save()
        tokens = get_tokens_for_user(user)
        return Response({
            'message': 'Account created successfully!',
            'user': UserSerializer(user).data,
            **tokens
        }, status=status.HTTP_201_CREATED)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(['POST'])
@permission_classes([AllowAny])
def login(request):
    """Login and receive JWT tokens"""
    serializer = LoginSerializer(data=request.data)
    if serializer.is_valid():
        user = serializer.validated_data['user']
        tokens = get_tokens_for_user(user)
        return Response({
            'message': 'Login successful!',
            'user': UserSerializer(user).data,
            **tokens
        }, status=status.HTTP_200_OK)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(['GET', 'PUT'])
@permission_classes([IsAuthenticated])
def profile(request):
    """Get or update the authenticated user's profile"""
    if request.method == 'GET':
        serializer = UserSerializer(request.user)
        return Response(serializer.data)

    elif request.method == 'PUT':
        serializer = UserSerializer(request.user, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            # Update nested profile
            if request.user.is_company and hasattr(request.user, 'company_profile'):
                from .serializers import CompanyProfileSerializer
                cp_data = {k: v for k, v in request.data.items() if k in ['company_name', 'description', 'website', 'industry', 'company_size', 'location']}
                if cp_data:
                    CompanyProfileSerializer(request.user.company_profile, data=cp_data, partial=True).is_valid(raise_exception=True)
                    CompanyProfileSerializer(request.user.company_profile, data=cp_data, partial=True).save()
            return Response({'message': 'Profile updated!', 'user': serializer.data})
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def upload_resume(request):
    """Upload or replace resume for applicant"""
    if not request.user.is_applicant:
        return Response({'error': 'Only applicants can upload resumes.'}, status=403)

    resume_file = request.FILES.get('resume')
    if not resume_file:
        return Response({'error': 'No file provided.'}, status=400)

    # Validate file type
    allowed_types = ['application/pdf', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document']
    if resume_file.content_type not in allowed_types:
        return Response({'error': 'Only PDF and DOCX files are allowed.'}, status=400)

    # Validate file size (5MB)
    if resume_file.size > 5 * 1024 * 1024:
        return Response({'error': 'File size must be under 5MB.'}, status=400)

    profile, _ = request.user.applicant_profile.__class__.objects.get_or_create(user=request.user)
    profile.resume = resume_file
    profile.save()

    return Response({'message': 'Resume uploaded successfully!', 'resume_url': request.build_absolute_uri(profile.resume.url)})
