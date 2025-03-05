from django.urls import path
from ninja import NinjaAPI
from ninja.security import django_auth
from django.contrib.auth import authenticate, login as django_login, logout as django_logout
from django.http import HttpRequest
from django.contrib.auth.models import User
from typing import Dict, Any, Optional
from pydantic import BaseModel

from hooks.api import router as hooks_router
from deployments.api import router as deployments_router
from gitlab_integration.api import router as gitlab_router
from audit.api import router as audit_router

# 定义请求和响应模型
class LoginRequest(BaseModel):
    username: str
    password: str

class UserResponse(BaseModel):
    id: int
    username: str
    email: str
    first_name: str
    last_name: str
    is_staff: bool

class ErrorResponse(BaseModel):
    message: str

api = NinjaAPI(title="GitLab Enhancer API", version="1.0.0")

# 注册各模块路由 - 添加认证要求
api.add_router("/hooks", hooks_router, auth=django_auth)
api.add_router("/deployments", deployments_router, auth=django_auth)
api.add_router("/gitlab", gitlab_router, auth=django_auth)
api.add_router("/audit-logs", audit_router, auth=django_auth)

# 添加认证相关API
@api.post("/auth/login", response={200: Dict[str, Any], 401: ErrorResponse})
def login(request: HttpRequest, data: LoginRequest):
    """
    登录用户并创建会话
    """
    user = authenticate(request, username=data.username, password=data.password)
    if user is not None:
        django_login(request, user)
        return {
            "user": {
                "id": user.id,
                "username": user.username,
                "email": user.email,
                "first_name": user.first_name,
                "last_name": user.last_name,
                "is_staff": user.is_staff
            }
        }
    else:
        return 401, {"message": "Invalid username or password"}

@api.post("/auth/logout", response={200: Dict[str, str]}, auth=django_auth)
def logout(request: HttpRequest):
    """
    登出用户并销毁会话
    """
    django_logout(request)
    return {"message": "Successfully logged out"}

@api.get("/auth/user", response={200: UserResponse, 401: ErrorResponse}, auth=django_auth)
def get_user(request: HttpRequest):
    """
    获取当前登录用户的信息
    """
    user = request.user
    if user.is_authenticated:
        return {
            "id": user.id,
            "username": user.username,
            "email": user.email,
            "first_name": user.first_name,
            "last_name": user.last_name,
            "is_staff": user.is_staff
        }
    else:
        return 401, {"message": "Not authenticated"}

urlpatterns = [
    path("", api.urls),
]