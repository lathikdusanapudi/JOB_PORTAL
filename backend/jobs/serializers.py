from rest_framework import serializers
from .models import Job


class JobListSerializer(serializers.ModelSerializer):
    """Lightweight serializer for job lists"""
    company_name = serializers.SerializerMethodField()
    applicants   = serializers.SerializerMethodField()

    class Meta:
        model  = Job
        fields = [
            'id', 'title', 'company_name', 'location', 'salary',
            'job_type', 'category', 'openings', 'is_active',
            'created_at', 'applicants',
        ]

    def get_company_name(self, obj):
        return obj.company_name

    def get_applicants(self, obj):
        return obj.applicant_count


class JobDetailSerializer(serializers.ModelSerializer):
    """Full serializer for job detail view"""
    company_name = serializers.SerializerMethodField()
    applicants   = serializers.SerializerMethodField()

    class Meta:
        model  = Job
        fields = [
            'id', 'title', 'company_name', 'description', 'location',
            'salary', 'salary_min', 'salary_max', 'job_type', 'category',
            'skills', 'requirements', 'openings', 'is_active',
            'created_at', 'updated_at', 'applicants',
        ]

    def get_company_name(self, obj):
        return obj.company_name

    def get_applicants(self, obj):
        return obj.applicant_count


class JobCreateUpdateSerializer(serializers.ModelSerializer):
    """Serializer for creating / updating jobs"""
    class Meta:
        model  = Job
        fields = [
            'id', 'title', 'description', 'location', 'salary',
            'salary_min', 'salary_max', 'job_type', 'category',
            'skills', 'requirements', 'openings', 'is_active',
        ]

    def create(self, validated_data):
        # Attach the requesting user as the company
        validated_data['company'] = self.context['request'].user
        return super().create(validated_data)
