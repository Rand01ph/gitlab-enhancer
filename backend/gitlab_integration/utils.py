import requests
from requests.exceptions import RequestException
from typing import List, Dict, Any

def test_gitlab_connection(url: str, token: str) -> Dict[str, Any]:
    """
    测试与 GitLab 实例的连接
    """
    try:
        # 确保 URL 以 '/' 结尾
        if not url.endswith('/'):
            url = url + '/'
        
        # 尝试获取 GitLab 版本信息
        response = requests.get(
            f"{url}api/v4/version",
            headers={"PRIVATE-TOKEN": token},
            timeout=10
        )
        
        response.raise_for_status()  # 如果响应状态码不是 2xx，会引发异常
        
        version_info = response.json()
        return {
            "success": True,
            "message": f"Successfully connected to GitLab {version_info.get('version', 'unknown version')}",
            "version": version_info
        }
    
    except RequestException as e:
        return {
            "success": False,
            "message": f"Failed to connect to GitLab: {str(e)}",
            "error": str(e)
        }

def get_gitlab_projects(url: str, token: str) -> List[Dict[str, Any]]:
    """
    获取 GitLab 项目列表
    """
    try:
        # 确保 URL 以 '/' 结尾
        if not url.endswith('/'):
            url = url + '/'

        # 获取项目列表
        response = requests.get(
            f"{url}api/v4/projects",
            headers={"PRIVATE-TOKEN": token},
            params={"per_page": 100},  # 获取更多项目
            timeout=30
        )

        response.raise_for_status()

        projects = response.json()
        return [
            {
                "id": str(project["id"]),
                "name": project["name"],
                "path_with_namespace": project["path_with_namespace"],
                "web_url": project["web_url"]
            }
            for project in projects
        ]

    except RequestException as e:
        print(f"Error fetching GitLab projects: {e}")
        return []

def get_gitlab_groups(url: str, token: str) -> List[Dict[str, Any]]:
    """
    获取 GitLab 组列表
    """
    try:
        # 确保 URL 以 '/' 结尾
        if not url.endswith('/'):
            url = url + '/'

        # 获取组列表
        response = requests.get(
            f"{url}api/v4/groups",
            headers={"PRIVATE-TOKEN": token},
            params={"per_page": 100},  # 获取更多组
            timeout=30
        )

        response.raise_for_status()

        groups = response.json()
        return [
            {
                "id": str(group["id"]),
                "name": group["name"],
                "path": group["path"],
                "full_path": group["full_path"],
                "web_url": group["web_url"]
            }
            for group in groups
        ]

    except RequestException as e:
        print(f"Error fetching GitLab groups: {e}")
        return []
