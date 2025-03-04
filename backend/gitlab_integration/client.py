import requests
from .models import GitLabConfig

class GitLabClient:
    """GitLab API客户端"""
    
    def __init__(self):
        # 获取活跃的GitLab配置
        config = GitLabConfig.objects.filter(is_active=True).first()
        if not config:
            raise ValueError("No active GitLab configuration found")
        
        self.base_url = config.url.rstrip('/')
        self.token = config.token
        self.headers = {'PRIVATE-TOKEN': self.token}
    
    def get_projects(self, page=1, per_page=20):
        """获取项目列表"""
        url = f"{self.base_url}/api/v4/projects"
        params = {
            'page': page,
            'per_page': per_page,
            'order_by': 'name',
            'sort': 'asc'
        }
        
        response = requests.get(url, headers=self.headers, params=params)
        response.raise_for_status()
        return response.json()
    
    def get_groups(self, page=1, per_page=20):
        """获取组列表"""
        url = f"{self.base_url}/api/v4/groups"
        params = {
            'page': page,
            'per_page': per_page,
            'order_by': 'name',
            'sort': 'asc'
        }
        
        response = requests.get(url, headers=self.headers, params=params)
        response.raise_for_status()
        return response.json()
    
    def deploy_server_hook(self, hook_file_path, hook_type):
        """部署服务器级别的hook"""
        # 这里应该实现实际的服务器级别hook部署逻辑
        # 可能需要通过SSH或其他方式访问GitLab服务器
        # 这里只是示例
        return True
    
    def deploy_project_hook(self, project_id, hook_file_path, hook_type):
        """部署项目级别的hook"""
        # 实现项目级别hook部署逻辑
        # 可能需要使用GitLab API或其他方式
        return True
    
    def deploy_group_hook(self, group_id, hook_file_path, hook_type):
        """部署组级别的hook（通过为组内所有项目部署）"""
        # 获取组内所有项目
        url = f"{self.base_url}/api/v4/groups/{group_id}/projects"
        params = {'per_page': 100}
        
        response = requests.get(url, headers=self.headers, params=params)
        response.raise_for_status()
        projects = response.json()
        
        # 为每个项目部署hook
        for project in projects:
            self.deploy_project_hook(project['id'], hook_file_path, hook_type)
        
        return True