from typing import List
from ninja import Router
from django.shortcuts import get_object_or_404

from .models import GitLabConfig
from .schemas import (
    GitLabConfigSchema, 
    GitLabConfigCreateSchema, 
    GitLabProjectSchema, 
    GitLabGroupSchema
)
from .client import GitLabClient

router = Router()

@router.get("/projects", response=List[GitLabProjectSchema])
def get_projects(request, page: int = 1, per_page: int = 20):
    """获取GitLab项目列表"""
    try:
        client = GitLabClient()
        projects = client.get_projects(page=page, per_page=per_page)
        
        result = []
        for project in projects:
            project_data = {
                "id": project['id'],
                "name": project['name'],
                "path_with_namespace": project['path_with_namespace'],
                "web_url": project['web_url']
            }
            result.append(project_data)
        
        return result
    except Exception as e:
        return []  # 在实际应用中应该返回适当的错误响应

@router.get("/groups", response=List[GitLabGroupSchema])
def get_groups(request, page: int = 1, per_page: int = 20):
    """获取GitLab组列表"""
    try:
        client = GitLabClient()
        groups = client.get_groups(page=page, per_page=per_page)
        
        result = []
        for group in groups:
            group_data = {
                "id": group['id'],
                "name": group['name'],
                "path": group['path'],
                "full_path": group['full_path'],
                "web_url": group['web_url']
            }
            result.append(group_data)
        
        return result
    except Exception as e:
        return []  # 在实际应用中应该返回适当的错误响应

@router.get("/config", response=GitLabConfigSchema)
def get_config(request):
    """获取GitLab配置"""
    config = GitLabConfig.objects.filter(is_active=True).first()
    if not config:
        return {"error": "No active GitLab configuration found"}
    
    return {
        "id": config.id,
        "url": config.url,
        "is_active": config.is_active,
        "created_at": config.created_at,
        "updated_at": config.updated_at
    }

@router.post("/config", response=GitLabConfigSchema)
def update_config(request, payload: GitLabConfigCreateSchema):
    """更新GitLab配置"""
    # 如果设置为活跃，则将其他配置设为非活跃
    if payload.is_active:
        GitLabConfig.objects.update(is_active=False)
    
    # 创建新配置
    config = GitLabConfig.objects.create(
        url=payload.url,
        token=payload.token,
        is_active=payload.is_active
    )
    
    return {
        "id": config.id,
        "url": config.url,
        "is_active": config.is_active,
        "created_at": config.created_at,
        "updated_at": config.updated_at
    }