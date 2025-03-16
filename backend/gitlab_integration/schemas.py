from typing import List, Optional
from ninja import Schema
from datetime import datetime

class GitLabConfigSchema(Schema):
    id: int
    url: str
    is_active: bool
    created_at: datetime
    updated_at: datetime

class GitLabConfigCreateSchema(Schema):
    url: str
    token: str
    is_active: bool = True

class GitLabConfigUpdateSchema(Schema):
    url: str
    token: Optional[str] = None
    is_active: bool = True

class GitLabProjectSchema(Schema):
    id: str
    name: str
    path_with_namespace: str
    web_url: str

class GitLabGroupSchema(Schema):
    id: str
    name: str
    path: str
    full_path: str
    web_url: str

# 添加成功响应模式
class SuccessResponseSchema(Schema):
    success: bool

# 添加测试连接响应模式
class TestConnectionResponseSchema(Schema):
    success: bool
    message: str
