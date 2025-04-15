#!/bin/bash

# Update system
sudo yum update -y

# Install Node.js
curl -sL https://rpm.nodesource.com/setup_18.x | sudo bash -
sudo yum install -y nodejs

# Install OpenSSL
sudo yum install -y openssl

# Create SSL certificate
sudo mkdir -p /etc/ssl/private
sudo openssl req -x509 -nodes -days 365 -newkey rsa:2048 \
  -keyout /etc/ssl/private/health-check.key \
  -out /etc/ssl/certs/health-check.crt \
  -subj "/C=US/ST=Washington/L=Seattle/O=Launch/CN=health-check.internal"

# Set permissions
sudo chmod 600 /etc/ssl/private/health-check.key
sudo chmod 644 /etc/ssl/certs/health-check.crt

# Get instance ID
INSTANCE_ID=$(curl -s http://169.254.169.254/latest/meta-data/instance-id)

# Create service file
cat << EOF | sudo tee /etc/systemd/system/health-check.service
[Unit]
Description=Health Check Server
After=network.target

[Service]
Environment=INSTANCE_ID=${INSTANCE_ID}
ExecStart=/usr/bin/node /opt/health-check/health-check-server.js
Restart=always
User=root
Group=root
WorkingDirectory=/opt/health-check

[Install]
WantedBy=multi-user.target
EOF

# Create application directory
sudo mkdir -p /opt/health-check
sudo chown ec2-user:ec2-user /opt/health-check

# Start service
sudo systemctl daemon-reload
sudo systemctl enable health-check
sudo systemctl start health-check

# Add firewall rule for HTTPS
sudo iptables -I INPUT -p tcp --dport 443 -j ACCEPT 