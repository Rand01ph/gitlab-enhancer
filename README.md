# GitLab DevOps 管理平台

> 🤖 **特别说明：** 本项目是一个完全由人工智能辅助创建的应用程序。从需求分析、架构设计到代码实现，均由 AI 与人类协作完成。这展示了 AI 在现代软件开发中的强大能力和应用潜力。

## 项目简介

GitLab DevOps 管理平台是一个专为 DevOps 团队设计的工具，旨在简化 GitLab 服务器的管理工作。本平台提供了集中化的界面，用于管理 GitLab 配置、Git Hooks 和自动化部署流程，使 DevOps 工程师能够更高效地管理和维护 GitLab 基础设施。

## 核心功能

### GitLab 配置管理
- 集中管理多个 GitLab 实例的连接配置
- 测试连接功能确保配置有效
- 安全存储和管理 API 令牌

### Git Hooks 管理
- 统一界面管理所有 Git Hooks
- 支持二进制可执行文件和多种脚本语言（Bash、Python、Ruby、Perl）
- 提供 Hook 版本控制和历史记录
- 灵活部署能力：支持服务器级别、项目级别和组级别部署

### 自动化部署
- 基于 GitLab 事件触发自动化部署流程
- 自定义部署脚本和配置
- 部署历史记录和状态监控

## 技术栈

### 前端
- React.js - 用户界面框架
- React Router - 前端路由管理
- Axios - HTTP 客户端
- DaisyUI & Tailwind CSS - UI 组件和样式

### 后端
- Django - Web 应用框架
- Django Ninja - API 开发
- PostgreSQL - 数据存储
- Celery - 异步任务处理

## 快速开始

### 环境要求
- Python 3.8+
- Node.js 14+
- PostgreSQL 12+

### 安装步骤

1. 克隆仓库
```bash
git clone https://github.com/yourusername/gitlab-devops-platform.git
cd gitlab-devops-platform
```

2. 安装后端依赖
```bash
cd backend
python -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate
pip install -r requirements.txt
```

3. 配置数据库
```bash
python manage.py migrate
python manage.py createsuperuser
```

4. 安装前端依赖
```bash
cd ../frontend
npm install
```

5. 启动开发服务器
```bash
# 在 backend 目录下
python manage.py runserver

# 在 frontend 目录下
npm start
```

6. 访问应用
- 前端: http://localhost:3000
- API: http://localhost:8000/api/
- 管理界面: http://localhost:8000/admin/

## 项目结构

```
gitlab-devops-platform/
├── backend/                  # Django 后端
│   ├── core/                 # 核心应用
│   ├── gitlab_integration/   # GitLab 集成模块
│   ├── hooks/                # Git Hooks 管理
│   ├── deployments/          # 部署管理
│   └── manage.py             # Django 管理脚本
│
├── frontend/                 # React 前端
│   ├── public/               # 静态资源
│   ├── src/                  # 源代码
│   │   ├── components/       # React 组件
│   │   ├── pages/            # 页面组件
│   │   ├── services/         # API 服务
│   │   └── App.jsx           # 主应用组件
│   └── package.json          # 依赖配置
│
└── README.md                 # 项目文档
```

## 使用指南

### GitLab 配置管理

1. 登录系统后，导航至 "GitLab 配置" 页面
2. 点击 "添加配置" 按钮创建新的 GitLab 连接
3. 输入 GitLab 实例 URL 和 API 令牌
4. 使用 "测试连接" 按钮验证配置是否有效
5. 保存配置后即可在其他功能中使用

### Git Hooks 管理

1. 导航至 "Git Hooks" 页面
2. 点击 "上传新 Hook" 按钮
3. 填写 Hook 信息并上传 Hook 文件
4. 在 Hook 详情页面，可以查看版本历史
5. 使用 "部署" 按钮将 Hook 部署到指定位置（服务器、项目或组）

### 自动化部署

1. 导航至 "部署" 页面
2. 点击 "创建部署" 按钮
3. 配置部署触发条件和执行脚本
4. 保存后，系统将根据配置的事件自动执行部署

## AI 创新应用

本项目展示了 AI 在软件开发中的多种应用：

- **代码生成**：完整的前后端代码由 AI 生成，包括复杂的表单处理和文件上传功能
- **架构设计**：系统架构和数据模型由 AI 根据需求进行设计
- **问题诊断**：开发过程中遇到的问题（如 URL 重定向、API 参数处理）由 AI 进行诊断和解决
- **文档生成**：项目文档和注释由 AI 生成，确保代码可读性和可维护性

## 贡献指南

欢迎对本项目进行贡献！请遵循以下步骤：

1. Fork 本仓库
2. 创建您的特性分支 (`git checkout -b feature/amazing-feature`)
3. 提交您的更改 (`git commit -m 'Add some amazing feature'`)
4. 推送到分支 (`git push origin feature/amazing-feature`)
5. 打开一个 Pull Request

## 许可证

本项目采用 MIT 许可证 - 详情请参阅 [LICENSE](LICENSE) 文件

## 联系方式

项目维护者 - tanyawei1991@gmail.com

---

*注：本 README 文件由人工智能生成，作为 AI 辅助软件开发的示例成果。*