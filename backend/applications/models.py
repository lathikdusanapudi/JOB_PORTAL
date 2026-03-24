from django.db import models
from django.conf import settings
from jobs.models import Job


class Application(models.Model):
    STATUS_CHOICES = [
        ('Applied',    'Applied'),
        ('Reviewing',  'Reviewing'),
        ('Rejected',   'Rejected'),
        ('Hired',      'Hired'),
    ]

    job         = models.ForeignKey(Job, on_delete=models.CASCADE, related_name='applications')
    applicant   = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name='applications',
        limit_choices_to={'role': 'applicant'},
    )
    resume      = models.FileField(upload_to='resumes/', blank=True, null=True)
    cover_letter = models.TextField(blank=True)
    status      = models.CharField(max_length=20, choices=STATUS_CHOICES, default='Applied')
    applied_at  = models.DateTimeField(auto_now_add=True)
    updated_at  = models.DateTimeField(auto_now=True)

    class Meta:
        db_table         = 'applications'
        ordering         = ['-applied_at']
        # Each applicant can apply to a job only once
        unique_together  = [['job', 'applicant']]

    def __str__(self):
        return f'{self.applicant.name} → {self.job.title}'
