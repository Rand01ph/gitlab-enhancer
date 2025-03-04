from django.urls import path
from ninja import NinjaAPI
from hooks.api import router as hooks_router
from deployments.api import router as deployments_router
from gitlab_integration.api import router as gitlab_router
from audit.api import router as audit_router

api = NinjaAPI(title="GitLab Enhancer API", version="1.0.0")

# 注册各模块路由
api.add_router("/hooks", hooks_router)
api.add_router("/deployments", deployments_router)
api.add_router("/gitlab", gitlab_router)
api.add_router("/audit-logs", audit_router)

# 添加认证相关API
@api.post("/auth/login")
def login(request):
    # 实现登录逻辑
    return {"message": "Login endpoint"}

@api.post("/auth/logout")
def logout(request):
    # 实现登出逻辑
    return {"message": "Logout endpoint"}

@api.get("/auth/user")
def get_user(request):
    # 获取当前用户信息
    return {"message": "User info endpoint"}

urlpatterns = [
    path("", api.urls),
]