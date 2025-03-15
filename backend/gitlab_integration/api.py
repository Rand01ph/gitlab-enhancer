from typing import List
from ninja import Router
from django.shortcuts import get_object_or_404
from ninja.pagination import paginate
from .models import GitLabConfig
from .schemas import (
    GitLabConfigSchema,
    GitLabConfigCreateSchema,
    GitLabConfigUpdateSchema,
    GitLabProjectSchema,
    GitLabGroupSchema
)
from .utils import test_gitlab_connection, get_gitlab_projects, get_gitlab_groups

router = Router()


# 获取所有 GitLab 配置
@router.get("/configs", response=List[GitLabConfigSchema])
@paginate
def list_gitlab_configs(request):
    return GitLabConfig.objects.all().order_by('-created_at')


# 获取单个 GitLab 配置
@router.get("/configs/{config_id}", response=GitLabConfigSchema)
def get_gitlab_config(request, config_id: int):
    return get_object_or_404(GitLabConfig, id=config_id)


# 创建 GitLab 配置
@router.post("/configs", response=GitLabConfigSchema)
def create_gitlab_config(request, payload: GitLabConfigCreateSchema):
    config = GitLabConfig.objects.create(
        url=payload.url,
        token=payload.token,
        is_active=payload.is_active
    )
    return config


# 更新 GitLab 配置
@router.put("/configs/{config_id}", response=GitLabConfigSchema)
def update_gitlab_config(request, config_id: int, payload: GitLabConfigUpdateSchema):
    config = get_object_or_404(GitLabConfig, id=config_id)

    # 更新 URL 和活动状态
    config.url = payload.url
    config.is_active = payload.is_active

    # 只有当 token 字段存在且不为空时，才更新 token
    if hasattr(payload, 'token') and payload.token:
        config.token = payload.token

    config.save()
    return config

# 删除 GitLab 配置
@router.delete("/configs/{config_id}")
def delete_gitlab_config(request, config_id: int):
    config = get_object_or_404(GitLabConfig, id=config_id)
    config.delete()
    return {"success": True}

# 测试 GitLab 连接
@router.post("/configs/{config_id}/test", response={"success": bool, "message": str})
def test_gitlab_connection_endpoint(request, config_id: int):
    config = get_object_or_404(GitLabConfig, id=config_id)
    result = test_gitlab_connection(config.url, config.token)

    return {
        "success": result.get("success", False),
        "message": result.get("message", "Unknown error")
    }


# 获取 GitLab 项目列表
@router.get("/configs/{config_id}/projects", response=List[GitLabProjectSchema])
def list_gitlab_projects(request, config_id: int):
    config = get_object_or_404(GitLabConfig, id=config_id)
    projects = get_gitlab_projects(config.url, config.token)
    return projects


# 获取 GitLab 组列表
@router.get("/configs/{config_id}/groups", response=List[GitLabGroupSchema])
def list_gitlab_groups(request, config_id: int):
    config = get_object_or_404(GitLabConfig, id=config_id)
    groups = get_gitlab_groups(config.url, config.token)
    return groups