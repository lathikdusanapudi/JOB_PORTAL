from rest_framework import serializers
from .models import Application
from jobs.serializers import JobListSerializer


class ApplicationSerializer(serializers.ModelSerializer):
    """Used when an applicant views their own applications"""
    job = JobListSerializer(read_only=True)

    class Meta:
        model  = Application
        fields = ['id', 'job', 'resume', 'cover_letter', 'status', 'applied_at']
        read_only_fields = ['id', 'status', 'applied_at']


class ApplicationCreateSerializer(serializers.ModelSerializer):
    """Used when submitting a new application"""
    class Meta:
        model  = Application
        fields = ['cover_letter', 'resume']

    def validate(self, data):
        request = self.context['request']
        job     = self.context['job']

        if not request.user.is_applicant:
            raise serializers.ValidationError('Only applicants can apply for jobs.')

        if Application.objects.filter(job=job, applicant=request.user).exists():
            raise serializers.ValidationError('You have already applied for this job.')

        return data

    def create(self, validated_data):
        return Application.objects.create(
            job=self.context['job'],
            applicant=self.context['request'].user,
            **validated_data,
        )


class ApplicantDetailSerializer(serializers.ModelSerializer):
    """Used by company to view applicant info"""
    applicant_name  = serializers.CharField(source='applicant.name', read_only=True)
    applicant_email = serializers.CharField(source='applicant.email', read_only=True)
    applicant_phone = serializers.CharField(source='applicant.phone', read_only=True)
    applicant_bio   = serializers.CharField(source='applicant.bio', read_only=True)
    skills = serializers.SerializerMethodField()

    class Meta:
        model  = Application
        fields = [
            'id', 'applicant_name', 'applicant_email', 'applicant_phone',
            'applicant_bio', 'skills', 'resume', 'cover_letter',
            'status', 'applied_at',
        ]

    def get_skills(self, obj):
        try:
            return obj.applicant.applicant_profile.skills
        except Exception:
            return []


class StatusUpdateSerializer(serializers.ModelSerializer):
    class Meta:
        model  = Application
        fields = ['status']
