from django.contrib.auth.models import AbstractBaseUser, BaseUserManager, PermissionsMixin
from django.db import models


class UserManager(BaseUserManager):
    def create_user(self, email, password=None, **extra_fields):
        if not email:
            raise ValueError('Email is required')
        email = self.normalize_email(email)
        user = self.model(email=email, **extra_fields)
        user.set_password(password)
        user.save(using=self._db)
        return user

    def create_superuser(self, email, password=None, **extra_fields):
        extra_fields.setdefault('is_staff', True)
        extra_fields.setdefault('is_superuser', True)
        extra_fields.setdefault('role', 'admin')
        return self.create_user(email, password, **extra_fields)


class User(AbstractBaseUser, PermissionsMixin):
    ROLE_CHOICES = [
        ('applicant', 'Applicant'),
        ('company', 'Company'),
        ('admin', 'Admin'),
    ]

    name = models.CharField(max_length=150)
    email = models.EmailField(unique=True)
    role = models.CharField(max_length=20, choices=ROLE_CHOICES, default='applicant')
    phone = models.CharField(max_length=15, blank=True)
    bio = models.TextField(blank=True)
    profile_picture = models.ImageField(upload_to='profiles/', blank=True, null=True)
    is_active = models.BooleanField(default=True)
    is_staff = models.BooleanField(default=False)
    date_joined = models.DateTimeField(auto_now_add=True)

    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = ['name']
    objects = UserManager()

    class Meta:
        db_table = 'users'
        verbose_name = 'User'
        verbose_name_plural = 'Users'

    def __str__(self):
        return f'{self.name} ({self.email})'

    @property
    def is_company(self):
        return self.role == 'company'

    @property
    def is_applicant(self):
        return self.role == 'applicant'


class CompanyProfile(models.Model):
    """Extended profile for company users"""
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='company_profile')
    company_name = models.CharField(max_length=200)
    description = models.TextField(blank=True)
    website = models.URLField(blank=True)
    logo = models.ImageField(upload_to='company_logos/', blank=True, null=True)
    industry = models.CharField(max_length=100, blank=True)
    company_size = models.CharField(max_length=50, blank=True)
    location = models.CharField(max_length=200, blank=True)
    founded_year = models.PositiveIntegerField(null=True, blank=True)

    class Meta:
        db_table = 'company_profiles'

    def __str__(self):
        return self.company_name


class ApplicantProfile(models.Model):
    """Extended profile for applicant users"""
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='applicant_profile')
    resume = models.FileField(upload_to='resumes/', blank=True, null=True)
    skills = models.JSONField(default=list, blank=True)
    experience_years = models.PositiveIntegerField(default=0)
    education = models.TextField(blank=True)
    portfolio_url = models.URLField(blank=True)
    linkedin_url = models.URLField(blank=True)

    class Meta:
        db_table = 'applicant_profiles'

    def __str__(self):
        return f'{self.user.name} - Profile'
