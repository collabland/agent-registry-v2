#!/bin/bash

# Deployment script for Agent Registry API
# Usage: ./deploy.sh

set -e

BRANCH="main"
APP_NAME="Production"

echo "🚀 Deploying to $APP_NAME..."
echo ""

# Check if we're on the correct branch
CURRENT_BRANCH=$(git branch --show-current)
if [ "$CURRENT_BRANCH" != "$BRANCH" ]; then
  echo "⚠️  Warning: You're on branch '$CURRENT_BRANCH' but deploying from '$BRANCH'"
  read -p "Switch to $BRANCH and continue? (y/n) " -n 1 -r
  echo
  if [[ $REPLY =~ ^[Yy]$ ]]; then
    git checkout $BRANCH
  else
    echo "❌ Deployment cancelled"
    exit 1
  fi
fi

# Check for uncommitted changes
if [[ -n $(git status -s) ]]; then
  echo "⚠️  Warning: You have uncommitted changes"
  git status -s
  read -p "Commit changes before deploying? (y/n) " -n 1 -r
  echo
  if [[ $REPLY =~ ^[Yy]$ ]]; then
    read -p "Commit message: " COMMIT_MSG
    git add .
    git commit -m "$COMMIT_MSG"
  fi
fi

# Deploy
echo ""
echo "📦 Deploying $BRANCH to $APP_NAME..."
git push heroku $BRANCH

echo ""
echo "✅ Deployment to $APP_NAME complete!"
echo ""
echo "🔍 Checking deployment status..."
heroku ps

echo ""
echo "🌐 App URL:"
heroku info | grep "Web URL"

echo ""
echo "📋 View logs with: npm run logs"
echo "   or: heroku logs --tail"
echo ""
echo "🎉 Done!"

