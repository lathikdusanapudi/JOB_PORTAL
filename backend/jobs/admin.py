from django.contrib import admin
from .models import Job


@admin.register(Job)
class JobAdmin(admin.ModelAdmin):
    list_display  = ('title', 'company_name', 'location', 'job_type', 'category', 'is_active', 'created_at')
    list_filter   = ('job_type', 'category', 'is_active')
    search_fields = ('title', 'location', 'description')
    ordering      = ('-created_at',)
    readonly_fields = ('created_at', 'updated_at')

    def company_name(self, obj):
        return obj.company_name
    company_name.short_description = 'Company'
