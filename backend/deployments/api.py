from typing import List
from ninja import Router
from django.shortcuts import get_object_or_404
from django.contrib.auth.models import User
from django.db.models import Q

from hooks.models import Hook, HookVersion
from .models import Deployment
from .schemas import DeploymentCreateSchema, DeploymentSchema, DeploymentListSchema

router = Router()

@router.post("/{hook_id}/deploy", response=DeploymentSchema)
def deploy_hook(request, hook_id: int, payload: DeploymentCreateSchema):
    """部署Hook"""
    hook = get_object_or_404(Hook, id=hook_id)
    user = User.objects.first()  # 临时使用第一个用户，实际应该使用认证用户
    
    # 确定使用哪个版本
    if payload.hook_version_id:
        hook_version = get_object_or_404(HookVersion, id=payload.hook_version_id, hook=hook)
    else:
        # 使用最新版本
        hook_version = hook.versions.first()
        if not hook_version:
            # 如果没有版本记录，创建一个初始版本
            hook_version = HookVersion.objects.create(
                hook=hook,
                version=1,
                file=hook.file,
                created_by=user
            )
    
    # 创建部署记录
    deployment = Deployment.objects.create(
        hook=hook,
        hook_version=hook_version,
        deployment_level=payload.deployment_level,
        target_id=payload.target_id,
        target_name=payload.target_name,
        deployed_by=user
    )
    
    # 这里应该添加实际的部署逻辑，例如调用GitLab API
    # 根据部署级别和目标进行不同的部署操作
    
    # 假设部署成功
    deployment.status = 'success'
    deployment.save()
    
    return {
        "id": deployment.id,
        "hook": {
            "id": hook.id,
            "name": hook.name
        },
        "hook_version": {
            "id": hook_version.id,
            "version": hook_version.version
        } if hook_version else None,
        "deployment_level": deployment.deployment_level,
        "target_id": deployment.target_id,
        "target_name": deployment.target_name,
        "status": deployment.status,
        "error_message": deployment.error_message,
        "deployed_at": deployment.deployed_at,
        "deployed_by": {
            "id": deployment.deployed_by.id,
            "username": deployment.deployed_by.username
        }
    }

@router.get("/", response=List[DeploymentListSchema])
def list_deployments(request, hook_id: int = None, status: str = None):
    """获取部署历史"""
    query = Q()
    
    if hook_id:
        query &= Q(hook_id=hook_id)
    
    if status:
        query &= Q(status=status)
    
    deployments = Deployment.objects.filter(query)
    
    result = []
    for deployment in deployments:
        deployment_data = {
            "id": deployment.id,
            "hook": {
                "id": deployment.hook.id,
                "name": deployment.hook.name
            },
            "hook_version": {
                "id": deployment.hook_version.id,
                "version": deployment.hook_version.version
            } if deployment.hook_version else None,
            "deployment_level": deployment.deployment_level,
            "target_id": deployment.target_id,
            "target_name": deployment.target_name,
            "status": deployment.status,
            "deployed_at": deployment.deployed_at,
            "deployed_by": {
                "id": deployment.deployed_by.id,
                "username": deployment.deployed_by.username
            }
        }
        result.append(deployment_data)
    
    return result

@router.get("/{deployment_id}", response=DeploymentSchema)
def get_deployment(request, deployment_id: int):
    """获取部署详情"""
    deployment = get_object_or_404(Deployment, id=deployment_id)
    
    return {
        "id": deployment.id,
        "hook": {
            "id": deployment.hook.id,
            "name": deployment.hook.name
        },
        "hook_version": {
            "id": deployment.hook_version.id,
            "version": deployment.hook_version.version
        } if deployment.hook_version else None,
        "deployment_level": deployment.deployment_level,
        "target_id": deployment.target_id,
        "target_name": deployment.target_name,
        "status": deployment.status,
        "error_message": deployment.error_message,
        "deployed_at": deployment.deployed_at,
        "deployed_by": {
            "id": deployment.deployed_by.id,
            "username": deployment.deployed_by.username
        }
    }