#!/bin/bash

# Deployment script for Agent Registry API
# Usage: ./deploy.sh [qa|prod]

set -e

ENV=$1

if [ -z "$ENV" ]; then
  echo "❌ Error: Environment not specified"
  echo "Usage: ./deploy.sh [qa|prod]"
  exit 1
fi

case $ENV in
  qa)
    REMOTE="qa"
    BRANCH="develop"
    APP_NAME="QA"
    ;;
  prod)
    REMOTE="production"
    BRANCH="main"
    APP_NAME="Production"
    ;;
  *)
    echo "❌ Error: Invalid environment '$ENV'"
    echo "Usage: ./deploy.sh [qa|prod]"
    exit 1
    ;;
esac

echo "🚀 Deploying to $APP_NAME environment..."
echo ""

# Check if we're on the correct branch
CURRENT_BRANCH=$(git branch --show-current)
if [ "$CURRENT_BRANCH" != "$BRANCH" ]; then
  echo "⚠️  Warning: You're on branch '$CURRENT_BRANCH' but deploying from '$BRANCH'"
  read -p "Continue? (y/n) " -n 1 -r
  echo
  if [[ ! $REPLY =~ ^[Yy]$ ]]; then
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
if [ "$ENV" == "qa" ]; then
  git push $REMOTE $BRANCH:main
else
  git push $REMOTE $BRANCH
fi

echo ""
echo "✅ Deployment to $APP_NAME complete!"
echo ""
echo "🔍 Checking deployment status..."
heroku ps --remote $REMOTE

echo ""
echo "🌐 App URL:"
heroku info --remote $REMOTE | grep "Web URL"

echo ""
echo "📋 View logs with: npm run logs:$ENV"
echo "   or: heroku logs --tail --remote $REMOTE"
echo ""
echo "🎉 Done!"

