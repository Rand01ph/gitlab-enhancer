from typing import Optional, List
from datetime import datetime
from ninja import Schema, ModelSchema
from django.db.models import Count

class UserSchema(Schema):
    id: int
    username: str


class HookVersionSchema(Schema):
    id: int
    version: int
    created_at: datetime


class HookCreateSchema(Schema):
    name: str
    description: str = ""
    hook_type: str
    file_type: str
    script_language: Optional[str] = None


class HookUpdateSchema(Schema):
    name: Optional[str] = None
    description: Optional[str] = None
    hook_type: Optional[str] = None
    file_type: Optional[str] = None
    script_language: Optional[str] = None


class HookSchema(Schema):
    id: int
    name: str
    description: str
    hook_type: str
    file_type: str
    script_language: Optional[str]
    file_url: str
    created_at: datetime
    updated_at: datetime
    created_by: UserSchema
    current_version: int


class HookListSchema(Schema):
    id: int
    name: str
    description: str
    hook_type: str
    file_type: str
    created_at: datetime
    updated_at: datetime
    created_by: UserSchema
    current_version: int
    deployments_count: int