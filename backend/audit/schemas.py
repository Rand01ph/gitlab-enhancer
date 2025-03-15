from typing import Dict, Optional, List
from datetime import datetime
from ninja import Schema

class UserInfoSchema(Schema):
    id: int
    username: str

class AuditLogSchema(Schema):
    id: int
    user: Optional[UserInfoSchema]
    action: str
    resource_type: str
    resource_id: str
    details: Dict
    ip_address: Optional[str]
    created_at: datetime

class AuditLogFilterSchema(Schema):
    user_id: Optional[int] = None
    action: Optional[str] = None
    resource_type: Optional[str] = None
    resource_id: Optional[str] = None
    start_date: Optional[datetime] = None
    end_date: Optional[datetime] = None
