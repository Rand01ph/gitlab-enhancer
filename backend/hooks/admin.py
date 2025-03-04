from django.contrib import admin
from .models import Hook, HookVersion

@admin.register(Hook)
class HookAdmin(admin.ModelAdmin):
    list_display = ('name', 'hook_type', 'file_type', 'created_at', 'updated_at', 'created_by')
    list_filter = ('hook_type', 'file_type', 'created_at')
    search_fields = ('name', 'description')

@admin.register(HookVersion)
class HookVersionAdmin(admin.ModelAdmin):
    list_display = ('hook', 'version', 'created_at', 'created_by')
    list_filter = ('created_at',)
    search_fields = ('hook__name',)