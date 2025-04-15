#!/bin/bash
INSTANCE_ID=$(curl -s http://169.254.169.254/latest/meta-data/instance-id)
PRIVATE_IP=$(curl -s http://169.254.169.254/latest/meta-data/local-ipv4)
PUBLIC_IP=$(curl -s http://checkip.amazonaws.com)
echo "Instance ID: $INSTANCE_ID"
echo "Private IP: $PRIVATE_IP"
echo "Public IP (via NAT): $PUBLIC_IP"
echo "Testing DNS Resolution..."
nslookup amazon.com
echo "Testing Package Repository Access..."
yum check-update --security -q
echo "Testing S3 Access via VPC Endpoint..."
aws s3 ls --region us-west-2
