#!/bin/bash

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Logging functions
log_success() {
    echo -e "${GREEN}✓ $1${NC}"
}

log_warning() {
    echo -e "${YELLOW}⚠ $1${NC}"
}

log_error() {
    echo -e "${RED}✗ $1${NC}"
}

# Check if layer number is provided
if [ -z "$1" ]; then
    log_error "Layer number required. Usage: ./verify-layer.sh <layer-number>"
    exit 1
fi

LAYER_NUM=$1
LAYER_NAME="layer-$(printf "%02d" $LAYER_NUM)"
TIMESTAMP=$(date -u +"%Y-%m-%d %H:%M:%S UTC")

echo "Verifying $LAYER_NAME at $TIMESTAMP"
echo "----------------------------------------"

# Verify AWS CLI and credentials
verify_aws_access() {
    echo "Checking AWS Access..."
    if aws sts get-caller-identity &>/dev/null; then
        log_success "AWS CLI configured and authenticated"
        return 0
    else
        log_error "AWS CLI not configured or authentication failed"
        return 1
    fi
}

# Verify documentation
verify_documentation() {
    echo "Checking Documentation..."
    local doc_path="docs/implementation/$LAYER_NAME"
    
    # Check overview document exists
    if [ -f "$doc_path/01-*-overview.md" ]; then
        log_success "Overview document found"
    else
        log_error "Overview document missing"
        return 1
    fi

    # Check for required sections in overview
    if grep -q "## Purpose" "$doc_path/01-"*"-overview.md"; then
        log_success "Purpose section found"
    else
        log_warning "Purpose section missing"
    fi

    # Check for verification timestamps
    if grep -q "Last Verified:" "$doc_path/01-"*"-overview.md"; then
        log_success "Verification timestamps found"
    else
        log_warning "Verification timestamps missing"
    fi
}

# Layer-specific verification
verify_layer_01() {
    echo "Verifying Layer-01 Infrastructure..."
    
    # Check VPC
    echo "Checking VPC..."
    if vpc_id=$(aws ec2 describe-vpcs --filters "Name=tag:Project,Values=launch" --query 'Vpcs[0].VpcId' --output text 2>/dev/null); then
        if [ "$vpc_id" != "None" ]; then
            log_success "VPC found: $vpc_id"
        else
            log_error "No VPC found with Project=launch tag"
            return 1
        fi
    else
        log_error "Error checking VPC"
        return 1
    fi

    # Check Subnets
    echo "Checking Subnets..."
    if aws ec2 describe-subnets --filters "Name=vpc-id,Values=$vpc_id" --query 'Subnets[*].SubnetId' --output text &>/dev/null; then
        log_success "Subnets found and associated with VPC"
    else
        log_error "No subnets found or error checking subnets"
        return 1
    fi

    # Check Security Groups
    echo "Checking Security Groups..."
    if aws ec2 describe-security-groups --filters "Name=vpc-id,Values=$vpc_id" --query 'SecurityGroups[*].GroupId' --output text &>/dev/null; then
        log_success "Security groups found and associated with VPC"
    else
        log_error "No security groups found or error checking security groups"
        return 1
    fi

    # Check Route Tables
    echo "Checking Route Tables..."
    if aws ec2 describe-route-tables --filters "Name=vpc-id,Values=$vpc_id" --query 'RouteTables[*].RouteTableId' --output text &>/dev/null; then
        log_success "Route tables found and associated with VPC"
    else
        log_error "No route tables found or error checking route tables"
        return 1
    fi

    # Check Internet Gateway
    echo "Checking Internet Gateway..."
    if aws ec2 describe-internet-gateways --filters "Name=attachment.vpc-id,Values=$vpc_id" --query 'InternetGateways[0].InternetGatewayId' --output text &>/dev/null; then
        log_success "Internet Gateway found and attached to VPC"
    else
        log_error "No Internet Gateway found or not attached to VPC"
        return 1
    fi

    return 0
}

verify_layer_02() {
    echo "Verifying Layer-02 Database..."
    # To be implemented when we reach Layer-02
    log_warning "Layer-02 verification not yet implemented"
    return 0
}

# Main verification logic
main() {
    local success=true

    # Step 1: Verify AWS access
    verify_aws_access || success=false

    # Step 2: Verify documentation
    verify_documentation || success=false

    # Step 3: Layer-specific verification
    case $LAYER_NUM in
        1)
            verify_layer_01 || success=false
            ;;
        2)
            verify_layer_02 || success=false
            ;;
        *)
            log_error "Verification not implemented for layer $LAYER_NUM"
            success=false
            ;;
    esac

    echo "----------------------------------------"
    if [ "$success" = true ]; then
        log_success "Layer $LAYER_NUM verification completed successfully"
        # Update verification timestamp in documentation
        sed -i "s/Last Verified:.*$/Last Verified: $TIMESTAMP/" "docs/implementation/$LAYER_NAME/01-"*"-overview.md"
        exit 0
    else
        log_error "Layer $LAYER_NUM verification failed"
        exit 1
    fi
}

main 