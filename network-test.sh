#!/bin/bash

MAX_RETRIES=5
RETRY_DELAY=30

function wait_for_ssh() {
    local host=$1
    local retries=0
    
    while [ $retries -lt $MAX_RETRIES ]; do
        echo "Attempting to connect to $host (attempt $((retries+1))/$MAX_RETRIES)..."
        if ssh -i launch-test-key.pem -o ConnectTimeout=5 -o BatchMode=yes -o StrictHostKeyChecking=no ec2-user@$host 'exit' 2>/dev/null; then
            echo "Successfully connected to $host"
            return 0
        fi
        retries=$((retries+1))
        if [ $retries -lt $MAX_RETRIES ]; then
            echo "Connection failed. Waiting $RETRY_DELAY seconds before retry..."
            sleep $RETRY_DELAY
        fi
    done
    echo "Failed to connect to $host after $MAX_RETRIES attempts"
    return 1
}

echo "=== Network Connectivity Test ==="
echo "Waiting for instances to be ready..."

if ! wait_for_ssh 44.247.48.35; then
    echo "Could not establish SSH connection to public instance. Exiting."
    exit 1
fi

echo -e "\n1. Testing Internal VPC Communication..."
ssh -i launch-test-key.pem -o BatchMode=yes -o StrictHostKeyChecking=no ec2-user@44.247.48.35 'ping -c 4 10.0.1.223'
echo "Internal VPC Test Exit Code: $?"

echo -e "\n2. Testing NAT Gateway (Internet Access)..."
ssh -i launch-test-key.pem -o BatchMode=yes -o StrictHostKeyChecking=no -J ec2-user@44.247.48.35 ec2-user@10.0.1.223 'curl -s https://api.ipify.org'
echo "NAT Gateway Test Exit Code: $?"

echo -e "\n3. Testing VPC Endpoint (S3 Access)..."
ssh -i launch-test-key.pem -o BatchMode=yes -o StrictHostKeyChecking=no -J ec2-user@44.247.48.35 ec2-user@10.0.1.223 'aws s3 ls'
echo "VPC Endpoint Test Exit Code: $?"

echo -e "\n4. Testing Load Balancer Access..."
ssh -i launch-test-key.pem -o BatchMode=yes -o StrictHostKeyChecking=no -J ec2-user@44.247.48.35 ec2-user@10.0.1.223 '
echo "Testing API ALB..."
curl -k -s https://internal-launch-alb-api-1496026960.us-west-2.elb.amazonaws.com/health
echo $? > /tmp/alb_api_status
echo "Testing Admin ALB..."
curl -k -s https://internal-launch-alb-admin-577028544.us-west-2.elb.amazonaws.com/health
echo $? > /tmp/alb_admin_status
echo "Testing Public ALB..."
curl -k -s https://internal-launch-alb-public-637903362.us-west-2.elb.amazonaws.com/health
echo $? > /tmp/alb_public_status
cat /tmp/alb_*_status
' 