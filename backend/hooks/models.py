from django.db import models
from django.contrib.auth.models import User

class Hook(models.Model):
    name = models.CharField(max_length=100)
    description = models.TextField(blank=True)
    hook_type = models.CharField(
        max_length=20,
        choices=[
            ('pre-receive', 'Pre-receive'),
            ('post-receive', 'Post-receive'),
            ('update', 'Update')
        ]
    )
    file_type = models.CharField(
        max_length=10,
        choices=[
            ('binary', 'Binary'),
            ('script', 'Script')
        ]
    )
    script_language = models.CharField(
        max_length=20,
        choices=[
            ('bash', 'Bash'),
            ('python', 'Python'),
            ('ruby', 'Ruby'),
            ('perl', 'Perl')
        ],
        null=True,
        blank=True
    )
    file = models.FileField(upload_to='hooks/')
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    created_by = models.ForeignKey(User, on_delete=models.CASCADE)

    class Meta:
        ordering = ['-updated_at']
        
    def __str__(self):
        return self.name


class HookVersion(models.Model):
    hook = models.ForeignKey(Hook, on_delete=models.CASCADE, related_name='versions')
    version = models.IntegerField()
    file = models.FileField(upload_to='hook_versions/')
    created_at = models.DateTimeField(auto_now_add=True)
    created_by = models.ForeignKey(User, on_delete=models.CASCADE)

    class Meta:
        ordering = ['-version']
        unique_together = ['hook', 'version']
        
    def __str__(self):
        return f"{self.hook.name} v{self.version}"