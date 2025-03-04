from typing import Optional, List
from datetime import datetime
from ninja import Schema

class HookInfoSchema(Schema):
    id: int
    name: str

class HookVersionInfoSchema(Schema):
    id: int
    version: int

class UserInfoSchema(Schema):
    id: int
    username: str

class DeploymentCreateSchema(Schema):
    deployment_level: str
    target_id: Optional[str] = None
    target_name: Optional[str] = None
    hook_version_id: Optional[int] = None  # 可选，如果不提供则使用最新版本

class DeploymentSchema(Schema):
    id: int
    hook: HookInfoSchema
    hook_version: Optional[HookVersionInfoSchema]
    deployment_level: str
    target_id: Optional[str]
    target_name: Optional[str]
    status: str
    error_message: str
    deployed_at: datetime
    deployed_by: UserInfoSchema

class DeploymentListSchema(Schema):
    id: int
    hook: HookInfoSchema
    hook_version: Optional[HookVersionInfoSchema]
    deployment_level: str
    target_id: Optional[str]
    target_name: Optional[str]
    status: str
    deployed_at: datetime
    deployed_by: UserInfoSchema