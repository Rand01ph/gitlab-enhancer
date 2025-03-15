# GitLab Enhancer 需求与方案设计

## 1. 用户故事一

我作为组织级DevOps工具管理员，我希望能管理部署到GitLab后台的server side hook。对于hook管理，我需要能在界面上面上传管理hook，能设置hook的名称，描述，hook类型，和hook本身。同时也能选择这个hook部署在server级别，还是project级别，由于不存在group级别的hook，所以同时需要配合对接GitLab的API，也能包装部署到group级别。总的来说，当前版本对于管理上的诉求，有hook上传，hook更新，及hook部署。

### 1.1 关键需求

1. **Hook 集中管理**
    - 统一界面管理所有 Git Hook
    - 支持二进制可执行文件和脚本类型的 Hook
    - 提供 Hook 版本控制和历史记录
2. **灵活部署能力**
    - 支持服务器级别、项目级别和组级别部署
3. **安全与审计**
    - 基于角色的访问控制
    - 完整的操作审计日志
    - 安全的认证机制

## 2. 技术方案设计

### 2.1 系统架构

采用前后端分离架构，后端使用 django-ninja 1.3.0，前端使用 react + vite + tailwindcss + daisyUI + typescript，数据库使用sqlite

### 2.2 数据模型设计

### 2.2.1 Hook 模型

```python
class Hook(models.Model):
    name = models.CharField(max_length=100)
    description = models.TextField(blank=True)
    hook_type = models.CharField(
        max_length=20,
        choices=[
            ('pre-receive', 'Pre-receive'),
            ('post-receive', 'Post-receive'),
            ('update', 'Update')
        ]
    )
    file_type = models.CharField(
        max_length=10,
        choices=[
            ('binary', 'Binary'),
            ('script', 'Script')
        ]
    )
    script_language = models.CharField(
        max_length=20,
        choices=[
            ('bash', 'Bash'),
            ('python', 'Python'),
            ('ruby', 'Ruby'),
            ('perl', 'Perl')
        ],
        null=True,
        blank=True
    )
    file = models.FileField(upload_to='hooks/')
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    created_by = models.ForeignKey(User, on_delete=models.CASCADE)

    class Meta:
        ordering = ['-updated_at']

```

### 2.2.2 Hook版本模型

```python
class HookVersion(models.Model):
    hook = models.ForeignKey(Hook, on_delete=models.CASCADE, related_name='versions')
    version = models.IntegerField()
    file = models.FileField(upload_to='hook_versions/')
    created_at = models.DateTimeField(auto_now_add=True)
    created_by = models.ForeignKey(User, on_delete=models.CASCADE)

    class Meta:
        ordering = ['-version']
        unique_together = ['hook', 'version']

```

### 2.2.3 部署模型

```python
class Deployment(models.Model):
    hook = models.ForeignKey(Hook, on_delete=models.CASCADE)
    hook_version = models.ForeignKey(HookVersion, on_delete=models.SET_NULL, null=True)
    deployment_level = models.CharField(
        max_length=10,
        choices=[
            ('server', 'Server'),
            ('project', 'Project'),
            ('group', 'Group')
        ]
    )
    target_id = models.CharField(max_length=100, null=True, blank=True)  # 项目ID或组ID
    target_name = models.CharField(max_length=255, null=True, blank=True)  # 项目名称或组名称
    status = models.CharField(
        max_length=20,
        choices=[
            ('pending', 'Pending'),
            ('success', 'Success'),
            ('failed', 'Failed')
        ],
        default='pending'
    )
    error_message = models.TextField(blank=True)
    deployed_at = models.DateTimeField(auto_now_add=True)
    deployed_by = models.ForeignKey(User, on_delete=models.CASCADE)

    class Meta:
        ordering = ['-deployed_at']

```

### 2.2.4 GitLab配置模型

```python
class GitLabConfig(models.Model):
    url = models.URLField()
    token = models.CharField(max_length=255)
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

```

### 2.2.5 审计日志模型

```python
class AuditLog(models.Model):
    user = models.ForeignKey(User, on_delete=models.SET_NULL, null=True)
    action = models.CharField(max_length=50)
    resource_type = models.CharField(max_length=50)
    resource_id = models.CharField(max_length=100, blank=True)
    details = models.JSONField(default=dict)
    ip_address = models.GenericIPAddressField(null=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['-created_at']

```

### 2.3 API 设计

### 2.3.1 认证 API

```
POST /api/auth/login/ - 用户登录
POST /api/auth/logout/ - 用户登出
GET /api/auth/user/ - 获取当前用户信息

```

### 2.3.2 Hook API

```
GET /api/hooks/ - 获取Hook列表
POST /api/hooks/ - 上传新Hook
GET /api/hooks/{id}/ - 获取Hook详情
PUT /api/hooks/{id}/ - 更新Hook（上传新版本）
DELETE /api/hooks/{id}/ - 删除Hook
GET /api/hooks/{id}/versions/ - 获取Hook版本历史

```

### 2.3.3 部署 API

```
POST /api/hooks/{id}/deploy/ - 部署Hook
GET /api/deployments/ - 获取部署历史
GET /api/deployments/{id}/ - 获取部署详情

```

### 2.3.4 GitLab API

```
GET /api/gitlab/projects/ - 获取GitLab项目列表
GET /api/gitlab/groups/ - 获取GitLab组列表
GET /api/gitlab/config/ - 获取GitLab配置
POST /api/gitlab/config/ - 更新GitLab配置

```

### 2.3.5 审计日志 API

```
GET /api/audit-logs/ - 获取审计日志

```

### 2.4 请求/响应数据结构

### 2.4.1 Hook 上传请求

```json
// POST /api/hooks/
{
  "name": "Check Commit Message",
  "description": "Validates commit message format",
  "hook_type": "pre-receive",
  "file_type": "script",
  "script_language": "bash",
  "file": [二进制文件]
}

```

### 2.4.2 Hook 上传响应

```json
{
  "id": 1,
  "name": "Check Commit Message",
  "description": "Validates commit message format",
  "hook_type": "pre-receive",
  "file_type": "script",
  "script_language": "bash",
  "file_url": "/media/hooks/check_commit_message.sh",
  "created_at": "2025-03-04T12:00:00Z",
  "updated_at": "2025-03-04T12:00:00Z",
  "created_by": {
    "id": 1,
    "username": "admin"
  },
  "current_version": 1
}

```

### 2.4.3 Hook 列表响应

```json
{
  "count": 1,
  "next": null,
  "previous": null,
  "results": [
    {
      "id": 1,
      "name": "Check Commit Message",
      "description": "Validates commit message format",
      "hook_type": "pre-receive",
      "file_type": "script",
      "created_at": "2025-03-04T12:00:00Z",
      "updated_at": "2025-03-04T12:00:00Z",
      "created_by": {
        "id": 1,
        "username": "admin"
      },
      "current_version": 1,
      "deployments_count": 0
    }
  ]
}

```

### 2.4.4 部署请求

```json
// POST /api/hooks/1/deploy/
{
  "deployment_level": "project",
  "target_id": "42",
  "target_name": "my-project"
}

```

### 2.4.5 部署响应

```json
{
  "id": 1,
  "hook": {
    "id": 1,
    "name": "Check Commit Message"
  },
  "hook_version": {
    "id": 1,
    "version": 1
  },
  "deployment_level": "project",
  "target_id": "42",
  "target_name": "my-project",
  "status": "pending",
  "error_message": "",
  "deployed_at": "2025-03-04T12:05:00Z",
  "deployed_by": {
    "id": 1,
    "username": "admin"
  }
}

```

### 2.4.6 部署历史响应

```json
{
  "count": 1,
  "next": null,
  "previous": null,
  "results": [
    {
      "id": 1,
      "hook": {
        "id": 1,
        "name": "Check Commit Message"
      },
      "hook_version": {
        "id": 1,
        "version": 1
      },
      "deployment_level": "project",
      "target_id": "42",
      "target_name": "my-project",
      "status": "success",
      "deployed_at": "2025-03-04T12:05:00Z",
      "deployed_by": {
        "id": 1,
        "username": "admin"
      }
    }
  ]
}

```

### 2.4.7 GitLab 项目列表响应

```json
{
  "count": 2,
  "next": null,
  "previous": null,
  "results": [
    {
      "id": "42",
      "name": "my-project",
      "path_with_namespace": "group/my-project",
      "web_url": "<https://gitlab.example.com/group/my-project>"
    },
    {
      "id": "43",
      "name": "another-project",
      "path_with_namespace": "group/another-project",
      "web_url": "<https://gitlab.example.com/group/another-project>"
    }
  ]
}

```

### 2.4.8 审计日志响应

```json
{
  "count": 2,
  "next": null,
  "previous": null,
  "results": [
    {
      "id": 1,
      "user": {
        "id": 1,
        "username": "admin"
      },
      "action": "hook_create",
      "resource_type": "hook",
      "resource_id": "1",
      "details": {
        "hook_name": "Check Commit Message",
        "hook_type": "pre-receive"
      },
      "ip_address": "192.168.1.1",
      "created_at": "2025-03-04T12:00:00Z"
    },
    {
      "id": 2,
      "user": {
        "id": 1,
        "username": "admin"
      },
      "action": "hook_deploy",
      "resource_type": "deployment",
      "resource_id": "1",
      "details": {
        "hook_id": 1,
        "hook_name": "Check Commit Message",
        "deployment_level": "project",
        "target_id": "42"
      },
      "ip_address": "192.168.1.1",
      "created_at": "2025-03-04T12:05:00Z"
    }
  ]
}

```

### 2.5 部署流程

1. 用户上传 Hook 文件并填写相关信息
2. 系统保存 Hook 并创建初始版本记录
3. 用户选择部署级别（server/project/group）和目标
4. 系统根据部署级别执行不同的部署逻辑:
    - server 级别: 直接部署到 GitLab 服务器的 hooks 目录
    - project 级别: 通过 GitLab API 部署到指定项目
    - group 级别: 通过 GitLab API 部署到组内所有项目
5. 系统记录部署结果和状态
6. 系统生成审计日志记录操作

### 2.6 安全设计

1. 基于 Django 内置认证系统实现用户认证
2. 对敏感信息如 GitLab API 令牌进行加密存储
3. 实施基于角色的访问控制
4. 验证上传文件的类型和大小
5. 记录完整的操作审计日志
6. CSRF 保护所有表单提交
