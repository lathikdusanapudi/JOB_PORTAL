from django.db import models
from django.conf import settings


class Job(models.Model):
    JOB_TYPE_CHOICES = [
        ('Full-time', 'Full-time'),
        ('Part-time', 'Part-time'),
        ('Remote', 'Remote'),
        ('Internship', 'Internship'),
        ('Contract', 'Contract'),
    ]

    CATEGORY_CHOICES = [
        ('Technology', 'Technology'),
        ('Design', 'Design'),
        ('Marketing', 'Marketing'),
        ('Management', 'Management'),
        ('Data Science', 'Data Science'),
        ('Finance', 'Finance'),
        ('Content', 'Content'),
        ('Sales', 'Sales'),
        ('HR', 'HR'),
    ]

    company     = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name='posted_jobs',
        limit_choices_to={'role': 'company'},
    )
    title       = models.CharField(max_length=200)
    description = models.TextField()
    location    = models.CharField(max_length=200)
    salary      = models.CharField(max_length=100, blank=True)
    salary_min  = models.PositiveIntegerField(default=0)
    salary_max  = models.PositiveIntegerField(default=0)
    job_type    = models.CharField(max_length=20, choices=JOB_TYPE_CHOICES, default='Full-time')
    category    = models.CharField(max_length=50, choices=CATEGORY_CHOICES, default='Technology')
    skills      = models.JSONField(default=list, blank=True)
    requirements = models.JSONField(default=list, blank=True)
    openings    = models.PositiveIntegerField(default=1)
    is_active   = models.BooleanField(default=True)
    created_at  = models.DateTimeField(auto_now_add=True)
    updated_at  = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = 'jobs'
        ordering = ['-created_at']

    def __str__(self):
        return f'{self.title} @ {self.company.name if hasattr(self.company, "company_profile") else self.company.email}'

    @property
    def company_name(self):
        try:
            return self.company.company_profile.company_name
        except Exception:
            return self.company.name

    @property
    def applicant_count(self):
        return self.applications.count()
