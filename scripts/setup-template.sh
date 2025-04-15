#!/bin/bash

# Template Setup Script
# This script initializes a new GitHub repository and pushes the template

set -e

# Configuration
TEMPLATE_NAME="launch-infrastructure-template"
GITHUB_ORG="your-org"  # Replace with your GitHub organization
GITHUB_USER=""         # Will be prompted if not set
GITHUB_TOKEN=""        # Will be prompted if not set

# Function to check if a command exists
command_exists() {
    command -v "$1" >/dev/null 2>&1
}

# Check prerequisites
if ! command_exists gh; then
    echo "Error: GitHub CLI (gh) is not installed"
    echo "Please install it from: https://cli.github.com/"
    exit 1
fi

if ! command_exists git; then
    echo "Error: Git is not installed"
    exit 1
fi

# Prompt for GitHub credentials if not set
if [ -z "$GITHUB_USER" ]; then
    read -p "Enter your GitHub username: " GITHUB_USER
fi

if [ -z "$GITHUB_TOKEN" ]; then
    read -s -p "Enter your GitHub personal access token: " GITHUB_TOKEN
    echo
fi

# Login to GitHub CLI
echo "Logging in to GitHub..."
echo "$GITHUB_TOKEN" | gh auth login --with-token

# Create new repository
echo "Creating new repository: ${GITHUB_ORG}/${TEMPLATE_NAME}"
gh repo create "${GITHUB_ORG}/${TEMPLATE_NAME}" \
    --public \
    --description "AWS Infrastructure Template for Web Applications" \
    --template ""

# Initialize git repository
echo "Initializing git repository..."
git init
git add .
git commit -m "Initial commit: Infrastructure template"

# Add remote and push
echo "Pushing to GitHub..."
git remote add origin "https://github.com/${GITHUB_ORG}/${TEMPLATE_NAME}.git"
git branch -M main
git push -u origin main

# Set up repository settings
echo "Configuring repository settings..."
gh api -X PATCH "/repos/${GITHUB_ORG}/${TEMPLATE_NAME}" \
    -f is_template=true \
    -f allow_auto_merge=true \
    -f delete_branch_on_merge=true

# Create initial GitHub Actions secrets
echo "Setting up GitHub Actions secrets..."
gh secret set AWS_ACCESS_KEY_ID -b"your-access-key" -R "${GITHUB_ORG}/${TEMPLATE_NAME}"
gh secret set AWS_SECRET_ACCESS_KEY -b"your-secret-key" -R "${GITHUB_ORG}/${TEMPLATE_NAME}"

echo "Template setup complete!"
echo "Repository URL: https://github.com/${GITHUB_ORG}/${TEMPLATE_NAME}"
echo "You can now use this repository as a template for new projects." 