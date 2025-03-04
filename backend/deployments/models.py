from django.db import models
from django.contrib.auth.models import User
from hooks.models import Hook, HookVersion

class Deployment(models.Model):
    hook = models.ForeignKey(Hook, on_delete=models.CASCADE)
    hook_version = models.ForeignKey(HookVersion, on_delete=models.SET_NULL, null=True)
    deployment_level = models.CharField(
        max_length=10,
        choices=[
            ('server', 'Server'),
            ('project', 'Project'),
            ('group', 'Group')
        ]
    )
    target_id = models.CharField(max_length=100, null=True, blank=True)  # 项目ID或组ID
    target_name = models.CharField(max_length=255, null=True, blank=True)  # 项目名称或组名称
    status = models.CharField(
        max_length=20,
        choices=[
            ('pending', 'Pending'),
            ('success', 'Success'),
            ('failed', 'Failed')
        ],
        default='pending'
    )
    error_message = models.TextField(blank=True)
    deployed_at = models.DateTimeField(auto_now_add=True)
    deployed_by = models.ForeignKey(User, on_delete=models.CASCADE)

    class Meta:
        ordering = ['-deployed_at']
        
    def __str__(self):
        return f"{self.hook.name} to {self.target_name or 'server'}"