from typing import List
from ninja import Router
from django.db.models import Q
from django.contrib.auth.models import User
from .models import AuditLog
from .schemas import AuditLogSchema, AuditLogFilterSchema

router = Router()

@router.get("/", response=List[AuditLogSchema])
def list_audit_logs(request, filters: AuditLogFilterSchema = None):
    """获取审计日志列表"""
    query = Q()
    
    if filters:
        if filters.user_id:
            query &= Q(user_id=filters.user_id)

        if filters.action:
            query &= Q(action=filters.action)

        if filters.resource_type:
            query &= Q(resource_type=filters.resource_type)

        if filters.resource_id:
            query &= Q(resource_id=filters.resource_id)

        if filters.start_date:
            query &= Q(created_at__gte=filters.start_date)

        if filters.end_date:
            query &= Q(created_at__lte=filters.end_date)

    logs = AuditLog.objects.filter(query)
    
    return logs

@router.get("/actions/", response=List[str])
def list_actions(request):
    """获取所有操作类型"""
    actions = AuditLog.objects.values_list('action', flat=True).distinct()
    return sorted(actions)

@router.get("/resource-types/", response=List[str])
def list_resource_types(request):
    """获取所有资源类型"""
    resource_types = AuditLog.objects.values_list('resource_type', flat=True).distinct()
    return sorted(resource_types)

@router.get("/users/", response=List[dict])
def list_users(request):
    """获取有审计日志的用户列表"""
    user_ids = AuditLog.objects.values_list('user_id', flat=True).distinct()
    users = User.objects.filter(id__in=user_ids).values('id', 'username')
    return list(users)
    return result