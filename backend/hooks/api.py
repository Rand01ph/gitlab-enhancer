from typing import List
from ninja import Router, File, Form
from ninja.files import UploadedFile
from django.shortcuts import get_object_or_404
from django.http import HttpResponse
from django.db.models import Count
from django.contrib.auth.models import User

from .models import Hook, HookVersion
from .schemas import (
    HookSchema, 
    HookListSchema, 
    HookCreateSchema, 
    HookUpdateSchema, 
    HookVersionSchema
)

router = Router()

@router.get("/", response=List[HookListSchema])
def list_hooks(request):
    """获取Hook列表"""
    hooks = Hook.objects.annotate(deployments_count=Count('deployment'))
    
    result = []
    for hook in hooks:
        latest_version = hook.versions.first()
        version_number = latest_version.version if latest_version else 1
        
        hook_data = {
            "id": hook.id,
            "name": hook.name,
            "description": hook.description,
            "hook_type": hook.hook_type,
            "file_type": hook.file_type,
            "created_at": hook.created_at,
            "updated_at": hook.updated_at,
            "created_by": {
                "id": hook.created_by.id,
                "username": hook.created_by.username
            },
            "current_version": version_number,
            "deployments_count": hook.deployments_count
        }
        result.append(hook_data)
    
    return result

@router.post("/", response=HookSchema)
def create_hook(
    request,
    name: str = Form(...),
    description: str = Form(""),
    hook_type: str = Form(...),
    file_type: str = Form(...),
    script_language: str = Form(None),
    file: UploadedFile = File(...)
):
    """上传新Hook"""
    # 在实际应用中，应该从请求中获取用户
    user = User.objects.first()  # 临时使用第一个用户，实际应该使用认证用户

    hook = Hook.objects.create(
        name=name,
        description=description,
        hook_type=hook_type,
        file_type=file_type,
        script_language=script_language,
        file=file,
        created_by=user
    )
    
    # 创建初始版本
    hook_version = HookVersion.objects.create(
        hook=hook,
        version=1,
        file=file,
        created_by=user
    )
    
    return {
        "id": hook.id,
        "name": hook.name,
        "description": hook.description,
        "hook_type": hook.hook_type,
        "file_type": hook.file_type,
        "script_language": hook.script_language,
        "file_url": hook.file.url if hook.file else None,
        "created_at": hook.created_at,
        "updated_at": hook.updated_at,
        "created_by": {
            "id": hook.created_by.id,
            "username": hook.created_by.username
        },
        "current_version": 1
    }

@router.get("/{hook_id}/", response=HookSchema)
def get_hook(request, hook_id: int):
    """获取Hook详情"""
    hook = get_object_or_404(Hook, id=hook_id)
    latest_version = hook.versions.first()
    version_number = latest_version.version if latest_version else 1
    
    return {
        "id": hook.id,
        "name": hook.name,
        "description": hook.description,
        "hook_type": hook.hook_type,
        "file_type": hook.file_type,
        "script_language": hook.script_language,
        "file_url": hook.file.url if hook.file else None,
        "created_at": hook.created_at,
        "updated_at": hook.updated_at,
        "created_by": {
            "id": hook.created_by.id,
            "username": hook.created_by.username
        },
        "current_version": version_number
    }

@router.put("/{hook_id}/", response=HookSchema)
def update_hook(
    request,
    hook_id: int,
    name: str = Form(...),
    description: str = Form(""),
    hook_type: str = Form(...),
    file_type: str = Form(...),
    script_language: str = Form(None),
    file: UploadedFile = File(None)
):
    """更新Hook（上传新版本）"""
    hook = get_object_or_404(Hook, id=hook_id)
    user = User.objects.first()  # 临时使用第一个用户，实际应该使用认证用户
    
    # 更新Hook基本信息
    hook.name = name
    hook.description = description
    hook.hook_type = hook_type
    hook.file_type = file_type
    hook.script_language = script_language

    # 如果提供了新文件，则更新文件并创建新版本
    if file:
        hook.file = file
        
        # 获取最新版本号
        latest_version = hook.versions.order_by('-version').first()
        new_version_number = latest_version.version + 1 if latest_version else 1
        
        # 创建新版本
        HookVersion.objects.create(
            hook=hook,
            version=new_version_number,
            file=file,
            created_by=user
        )
    
    hook.save()
    
    # 获取最新版本号
    latest_version = hook.versions.first()
    version_number = latest_version.version if latest_version else 1
    
    return {
        "id": hook.id,
        "name": hook.name,
        "description": hook.description,
        "hook_type": hook.hook_type,
        "file_type": hook.file_type,
        "script_language": hook.script_language,
        "file_url": hook.file.url if hook.file else None,
        "created_at": hook.created_at,
        "updated_at": hook.updated_at,
        "created_by": {
            "id": hook.created_by.id,
            "username": hook.created_by.username
        },
        "current_version": version_number
    }

@router.delete("/{hook_id}/")
def delete_hook(request, hook_id: int):
    """删除Hook"""
    hook = get_object_or_404(Hook, id=hook_id)
    hook.delete()
    return {"success": True}

@router.get("/{hook_id}/versions/", response=List[HookVersionSchema])
def get_hook_versions(request, hook_id: int):
    """获取Hook版本历史"""
    hook = get_object_or_404(Hook, id=hook_id)
    versions = hook.versions.all()
    
    result = []
    for version in versions:
        version_data = {
            "id": version.id,
            "version": version.version,
            "created_at": version.created_at
        }
        result.append(version_data)
    
    return result

@router.get("/{hook_id}/versions/{version_id}/download/")
def download_hook_version(request, hook_id: int, version_id: int):
    """下载特定版本的Hook文件"""
    hook = get_object_or_404(Hook, id=hook_id)
    version = get_object_or_404(HookVersion, id=version_id, hook=hook)
    
    response = HttpResponse(version.file, content_type='application/octet-stream')
    response['Content-Disposition'] = f'attachment; filename="{version.file.name.split("/")[-1]}"'
    return response