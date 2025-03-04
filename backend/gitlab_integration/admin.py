from django.contrib import admin
from .models import GitLabConfig

@admin.register(GitLabConfig)
class GitLabConfigAdmin(admin.ModelAdmin):
    list_display = ('url', 'is_active', 'created_at', 'updated_at')