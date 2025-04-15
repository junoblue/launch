#!/bin/bash

# Create the OIDC provider for GitHub Actions
aws iam create-open-id-connect-provider \
  --url https://token.actions.githubusercontent.com \
  --thumbprint-list "6938fd4d98bab03faadb97b34396831e3780aea1" \
  --client-id-list "sts.amazonaws.com"

# Create the IAM role for GitHub Actions
aws iam create-role \
  --role-name launch-github-actions-role \
  --assume-role-policy-document file://iam/github-actions-role.json

# Create the IAM policy
aws iam create-policy \
  --policy-name launch-github-actions-policy \
  --policy-document file://iam/github-actions-policy.json

# Attach the policy to the role
aws iam attach-role-policy \
  --role-name launch-github-actions-role \
  --policy-arn arn:aws:iam::597088015766:policy/launch-github-actions-policy 