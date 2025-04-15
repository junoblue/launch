#!/bin/bash

# Backup and Rollback Script for AWS Infrastructure
# This script creates backups of infrastructure state and provides rollback functionality

set -e

# Configuration
BACKUP_DIR="backups"
TIMESTAMP=$(date +%Y%m%d_%H%M%S)
BACKUP_NAME="infrastructure_backup_${TIMESTAMP}"
AWS_REGION="us-east-1"

# Create backup directory if it doesn't exist
mkdir -p "${BACKUP_DIR}"

# Function to create backup
create_backup() {
    echo "Creating infrastructure backup..."
    
    # Backup CloudFormation templates
    mkdir -p "${BACKUP_DIR}/${BACKUP_NAME}/cloudformation"
    aws cloudformation list-stacks --region ${AWS_REGION} > "${BACKUP_DIR}/${BACKUP_NAME}/cloudformation/stacks.json"
    
    # Backup CDK context
    if [ -d "aws/infrastructure/cdk.out" ]; then
        cp -r aws/infrastructure/cdk.out "${BACKUP_DIR}/${BACKUP_NAME}/"
    fi
    
    # Backup infrastructure code
    tar -czf "${BACKUP_DIR}/${BACKUP_NAME}/infrastructure_code.tar.gz" aws/infrastructure/
    
    # Create backup manifest
    cat > "${BACKUP_DIR}/${BACKUP_NAME}/manifest.json" << EOF
{
    "timestamp": "${TIMESTAMP}",
    "backup_name": "${BACKUP_NAME}",
    "region": "${AWS_REGION}",
    "components": [
        "cloudformation_templates",
        "cdk_context",
        "infrastructure_code"
    ]
}
EOF
    
    echo "Backup created successfully: ${BACKUP_DIR}/${BACKUP_NAME}"
}

# Function to list available backups
list_backups() {
    echo "Available backups:"
    ls -l "${BACKUP_DIR}" | grep -v "total"
}

# Function to rollback to a specific backup
rollback() {
    local backup_name=$1
    
    if [ -z "${backup_name}" ]; then
        echo "Error: Backup name not provided"
        exit 1
    fi
    
    if [ ! -d "${BACKUP_DIR}/${backup_name}" ]; then
        echo "Error: Backup ${backup_name} not found"
        exit 1
    fi
    
    echo "Rolling back to backup: ${backup_name}"
    
    # Restore infrastructure code
    if [ -f "${BACKUP_DIR}/${backup_name}/infrastructure_code.tar.gz" ]; then
        echo "Restoring infrastructure code..."
        rm -rf aws/infrastructure/
        tar -xzf "${BACKUP_DIR}/${backup_name}/infrastructure_code.tar.gz" -C .
    fi
    
    # Restore CDK context
    if [ -d "${BACKUP_DIR}/${backup_name}/cdk.out" ]; then
        echo "Restoring CDK context..."
        rm -rf aws/infrastructure/cdk.out
        cp -r "${BACKUP_DIR}/${backup_name}/cdk.out" aws/infrastructure/
    fi
    
    echo "Rollback completed successfully"
}

# Main script logic
case "$1" in
    "create")
        create_backup
        ;;
    "list")
        list_backups
        ;;
    "rollback")
        rollback "$2"
        ;;
    *)
        echo "Usage: $0 {create|list|rollback [backup_name]}"
        exit 1
        ;;
esac 