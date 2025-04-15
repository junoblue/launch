from http.server import HTTPServer, BaseHTTPRequestHandler
import ssl
import json
import datetime
import subprocess

class HealthCheckHandler(BaseHTTPRequestHandler):
    def do_GET(self):
        if self.path == '/health':
            self.send_response(200)
            self.send_header('Content-type', 'application/json')
            self.end_headers()
            
            # Get instance ID
            try:
                instance_id = subprocess.check_output(['curl', '-s', 'http://169.254.169.254/latest/meta-data/instance-id']).decode('utf-8')
            except:
                instance_id = 'unknown'
            
            response = {
                'status': 'healthy',
                'timestamp': datetime.datetime.now().isoformat(),
                'instance': instance_id
            }
            self.wfile.write(json.dumps(response).encode())
        else:
            self.send_response(404)
            self.end_headers()

httpd = HTTPServer(('0.0.0.0', 443), HealthCheckHandler)

# Create self-signed certificate
ssl_cmd = [
    'openssl', 'req', '-x509', '-nodes', '-days', '365', '-newkey', 'rsa:2048',
    '-keyout', '/tmp/health-check.key',
    '-out', '/tmp/health-check.crt',
    '-subj', '/C=US/ST=Washington/L=Seattle/O=Launch/CN=health-check.internal'
]
subprocess.run(ssl_cmd)

# Configure SSL
httpd.socket = ssl.wrap_socket(
    httpd.socket,
    keyfile='/tmp/health-check.key',
    certfile='/tmp/health-check.crt',
    server_side=True
)

print('Health check server running on port 443...')
httpd.serve_forever() 