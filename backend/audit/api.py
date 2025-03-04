from typing import List
from ninja import Router
from django.db.models import Q

from .models import AuditLog
from .schemas import AuditLogSchema

router = Router()

@router.get("/", response=List[AuditLogSchema])
def list_audit_logs(request, action: str = None, resource_type: str = None, 
                   resource_id: str = None, user_id: int = None, 
                   start_date: str = None, end_date: str = None, 
                   page: int = 1, per_page: int = 20):
    """获取审计日志"""
    query = Q()
    
    if action:
        query &= Q(action=action)
    
    if resource_type:
        query &= Q(resource_type=resource_type)
    
    if resource_id:
        query &= Q(resource_id=resource_id)
    
    if user_id:
        query &= Q(user_id=user_id)
    
    if start_date:
        query &= Q(created_at__gte=start_date)
    
    if end_date:
        query &= Q(created_at__lte=end_date)
    
    logs = AuditLog.objects.filter(query)
    
    # 分页
    start = (page - 1) * per_page
    end = page * per_page
    logs = logs[start:end]
    
    result = []
    for log in logs:
        log_data = {
            "id": log.id,
            "user": {
                "id": log.user.id,
                "username": log.user.username
            } if log.user else None,
            "action": log.action,
            "resource_type": log.resource_type,
            "resource_id": log.resource_id,
            "details": log.details,
            "ip_address": log.ip_address,
            "created_at": log.created_at
        }
        result.append(log_data)
    
    return result