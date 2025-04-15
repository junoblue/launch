#!/bin/bash

# Create S3 bucket
aws s3api create-bucket \
  --bucket login-tokyoflo-com \
  --region us-west-2 \
  --create-bucket-configuration LocationConstraint=us-west-2

# Enable bucket versioning
aws s3api put-bucket-versioning \
  --bucket login-tokyoflo-com \
  --versioning-configuration Status=Enabled

# Block public access
aws s3api put-public-access-block \
  --bucket login-tokyoflo-com \
  --public-access-block-configuration '{"BlockPublicAcls": true, "IgnorePublicAcls": true, "BlockPublicPolicy": true, "RestrictPublicBuckets": true}'

# Get CloudFront distribution ID
DIST_ID=$(aws cloudfront list-distributions --query "DistributionList.Items[?Aliases.Items[?contains(@, 'login.tokyoflo.com')]].Id" --output text)

if [ -n "$DIST_ID" ]; then
  # Replace placeholder in bucket policy
  sed "s/\${CLOUDFRONT_DISTRIBUTION_ID}/$DIST_ID/" infrastructure/s3/login-bucket-policy.json > /tmp/bucket-policy.json

  # Apply bucket policy
  aws s3api put-bucket-policy \
    --bucket login-tokyoflo-com \
    --policy file:///tmp/bucket-policy.json

  echo "S3 bucket setup complete with CloudFront distribution ID: $DIST_ID"
else
  echo "Error: Could not find CloudFront distribution for login.tokyoflo.com"
  exit 1
fi 