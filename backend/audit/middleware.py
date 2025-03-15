import json
import re
from django.utils.deprecation import MiddlewareMixin
from django.contrib.auth.models import AnonymousUser
from .models import AuditLog

# Paths that should not be logged
EXCLUDED_PATHS = [
    r'^/api/auth/user/$',  # Skip user info endpoint
    r'^/api/audit-logs/$',  # Skip audit logs endpoint itself
    r'^/static/',          # Skip static files
    r'^/media/',           # Skip media files
]

# Request methods that should be logged
LOGGED_METHODS = ['POST', 'PUT', 'PATCH', 'DELETE']

class AuditLogMiddleware(MiddlewareMixin):
    def __init__(self, get_response=None):
        self.get_response = get_response
        self.excluded_paths_regex = [re.compile(path) for path in EXCLUDED_PATHS]
        super().__init__(get_response)

    def should_log(self, request):
        # Skip if path is in excluded paths
        path = request.path
        for pattern in self.excluded_paths_regex:
            if pattern.match(path):
                return False

        # Only log specific methods
        if request.method not in LOGGED_METHODS:
            return False

        return True

    def get_client_ip(self, request):
        x_forwarded_for = request.META.get('HTTP_X_FORWARDED_FOR')
        if x_forwarded_for:
            ip = x_forwarded_for.split(',')[0]
        else:
            ip = request.META.get('REMOTE_ADDR')
        return ip

    def map_path_to_resource(self, path, method):
        """Map request path to resource type and action"""
        # Default values
        resource_type = "unknown"
        action = method.lower()
        resource_id = ""

        # Extract resource type and ID from path
        # Example: /api/hooks/1/deploy/ -> resource_type: hook, action: deploy, resource_id: 1
        path_parts = path.strip('/').split('/')
        
        if len(path_parts) >= 2 and path_parts[0] == 'api':
            if len(path_parts) >= 3:
                resource_type = path_parts[1]
                # Remove trailing 's' from resource type (e.g., 'hooks' -> 'hook')
                if resource_type.endswith('s'):
                    resource_type = resource_type[:-1]
                
                # Check if the next part is an ID
                if len(path_parts) >= 3 and path_parts[2].isdigit():
                    resource_id = path_parts[2]
                    
                    # Check if there's an action after the ID
                    if len(path_parts) >= 4:
                        action = path_parts[3]
                else:
                    # No ID, just an action on the resource type
                    action = path_parts[2] if len(path_parts) >= 3 else action
        
        # Map HTTP method to action if no specific action is found
        if action == method.lower():
            if method == 'POST':
                action = 'create'
            elif method == 'PUT' or method == 'PATCH':
                action = 'update'
            elif method == 'DELETE':
                action = 'delete'
        
        return resource_type, action, resource_id

    def extract_request_body(self, request):
        """Extract and sanitize request body for logging"""
        if not request.body:
            return {}
            
        try:
            body = json.loads(request.body.decode('utf-8'))
            # Sanitize sensitive fields
            if isinstance(body, dict):
                sanitized = body.copy()
                for key in body:
                    if any(sensitive in key.lower() for sensitive in ['password', 'token', 'secret', 'key']):
                        sanitized[key] = '******'
                return sanitized
            return body
        except json.JSONDecodeError:
            return {'raw': 'non-JSON body'}
        except Exception:
            return {'error': 'Could not parse request body'}

    def process_view(self, request, view_func, view_args, view_kwargs):
        if not self.should_log(request):
            return None

        # Store view_kwargs in request for later use in process_response
        request.view_kwargs = view_kwargs

        # Continue with normal request processing
        return None

    def process_response(self, request, response):
        if not self.should_log(request):
            return response

        # Don't log if user is not authenticated
        if isinstance(request.user, AnonymousUser):
            return response

        # Extract resource information
        resource_type, action, resource_id = self.map_path_to_resource(request.path, request.method)
        
        # Prepare details
        details = {
            'method': request.method,
            'path': request.path,
        }
        
        # Add request body for certain methods
        if request.method in ['POST', 'PUT', 'PATCH']:
            details['request'] = self.extract_request_body(request)
            
        # Add response status
        details['status_code'] = response.status_code
        
        # Add response data for successful requests
        if 200 <= response.status_code < 300 and hasattr(response, 'content'):
            try:
                response_data = json.loads(response.content.decode('utf-8'))
                # Extract relevant fields from response
                if isinstance(response_data, dict):
                    if 'id' in response_data:
                        details['result_id'] = response_data['id']
                    if 'name' in response_data:
                        details['result_name'] = response_data['name']
            except (json.JSONDecodeError, UnicodeDecodeError):
                pass

        # Get view_kwargs from request if available
        view_kwargs = getattr(request, 'view_kwargs', {})

        # Create audit log entry
        AuditLog.objects.create(
            user=request.user,
            action=f"{resource_type}_{action}",
            resource_type=resource_type,
            resource_id=resource_id or view_kwargs.get('id', ''),
            details=details,
            ip_address=self.get_client_ip(request)
        )

        return response