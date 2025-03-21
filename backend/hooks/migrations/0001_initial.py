# Generated by Django 5.1.6 on 2025-03-04 15:15

import django.db.models.deletion
from django.conf import settings
from django.db import migrations, models


class Migration(migrations.Migration):

    initial = True

    dependencies = [
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
    ]

    operations = [
        migrations.CreateModel(
            name='Hook',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('name', models.CharField(max_length=100)),
                ('description', models.TextField(blank=True)),
                ('hook_type', models.CharField(choices=[('pre-receive', 'Pre-receive'), ('post-receive', 'Post-receive'), ('update', 'Update')], max_length=20)),
                ('file_type', models.CharField(choices=[('binary', 'Binary'), ('script', 'Script')], max_length=10)),
                ('script_language', models.CharField(blank=True, choices=[('bash', 'Bash'), ('python', 'Python'), ('ruby', 'Ruby'), ('perl', 'Perl')], max_length=20, null=True)),
                ('file', models.FileField(upload_to='hooks/')),
                ('created_at', models.DateTimeField(auto_now_add=True)),
                ('updated_at', models.DateTimeField(auto_now=True)),
                ('created_by', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to=settings.AUTH_USER_MODEL)),
            ],
            options={
                'ordering': ['-updated_at'],
            },
        ),
        migrations.CreateModel(
            name='HookVersion',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('version', models.IntegerField()),
                ('file', models.FileField(upload_to='hook_versions/')),
                ('created_at', models.DateTimeField(auto_now_add=True)),
                ('created_by', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to=settings.AUTH_USER_MODEL)),
                ('hook', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='versions', to='hooks.hook')),
            ],
            options={
                'ordering': ['-version'],
                'unique_together': {('hook', 'version')},
            },
        ),
    ]
