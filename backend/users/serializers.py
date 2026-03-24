from rest_framework import serializers
from rest_framework_simplejwt.tokens import RefreshToken
from django.contrib.auth import authenticate
from .models import User, CompanyProfile, ApplicantProfile


class RegisterSerializer(serializers.ModelSerializer):
    password     = serializers.CharField(write_only=True, min_length=6)
    company_name = serializers.CharField(required=False, allow_blank=True, default='')

    class Meta:
        model  = User
        fields = ['id', 'name', 'email', 'password', 'role', 'company_name']

    def validate_email(self, value):
        if User.objects.filter(email=value).exists():
            raise serializers.ValidationError('An account with this email already exists.')
        return value

    def validate(self, data):
        if data.get('role') == 'company' and not data.get('company_name', '').strip():
            raise serializers.ValidationError(
                {'company_name': 'Company name is required for company accounts.'}
            )
        return data

    def create(self, validated_data):
        company_name = validated_data.pop('company_name', '')
        password     = validated_data.pop('password')
        user         = User.objects.create_user(password=password, **validated_data)

        if user.role == 'company':
            CompanyProfile.objects.create(
                user=user,
                company_name=company_name or user.name,
            )
        elif user.role == 'applicant':
            ApplicantProfile.objects.create(user=user)

        return user


class LoginSerializer(serializers.Serializer):
    email    = serializers.EmailField()
    password = serializers.CharField(write_only=True)

    def validate(self, data):
        user = authenticate(email=data['email'], password=data['password'])
        if not user:
            raise serializers.ValidationError(
                'Invalid email or password. Please try again.'
            )
        if not user.is_active:
            raise serializers.ValidationError('This account has been deactivated.')
        data['user'] = user
        return data


class CompanyProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model  = CompanyProfile
        fields = '__all__'
        read_only_fields = ['user']


class ApplicantProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model  = ApplicantProfile
        fields = '__all__'
        read_only_fields = ['user']


class UserSerializer(serializers.ModelSerializer):
    company_profile  = CompanyProfileSerializer(read_only=True)
    applicant_profile = ApplicantProfileSerializer(read_only=True)

    class Meta:
        model  = User
        fields = [
            'id', 'name', 'email', 'role', 'phone', 'bio',
            'profile_picture', 'date_joined',
            'company_profile', 'applicant_profile',
        ]
        read_only_fields = ['id', 'date_joined', 'role']


def get_tokens_for_user(user):
    refresh = RefreshToken.for_user(user)
    return {
        'refresh': str(refresh),
        'access':  str(refresh.access_token),
    }