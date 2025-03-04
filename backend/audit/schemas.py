from typing import Dict, Any, List, Optional
from datetime import datetime
from ninja import Schema

class UserAuditSchema(Schema):
    id: int
    username: str

class AuditLogSchema(Schema):
    id: int
    user: Optional[UserAuditSchema]
    action: str
    resource_type: str
    resource_id: str
    details: Dict[str, Any]
    ip_address: Optional[str]
    created_at: datetime