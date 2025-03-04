from django.contrib import admin
from .models import Deployment

@admin.register(Deployment)
class DeploymentAdmin(admin.ModelAdmin):
    list_display = ('hook', 'hook_version', 'deployment_level', 'target_name', 'status', 'deployed_at', 'deployed_by')
    list_filter = ('status', 'deployment_level', 'deployed_at')
    search_fields = ('hook__name', 'target_name')