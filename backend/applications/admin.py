from django.contrib import admin
from .models import Application


@admin.register(Application)
class ApplicationAdmin(admin.ModelAdmin):
    list_display  = ('applicant', 'job_title', 'status', 'applied_at')
    list_filter   = ('status',)
    search_fields = ('applicant__name', 'applicant__email', 'job__title')
    ordering      = ('-applied_at',)
    readonly_fields = ('applied_at', 'updated_at')

    def job_title(self, obj):
        return obj.job.title
    job_title.short_description = 'Job'
