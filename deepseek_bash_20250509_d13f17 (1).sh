#!/bin/bash

# GitHub Pages Upload Script
# This automates the process of deploying your AI chatbot to GitHub Pages

# Configuration
REPO_NAME="ai-chatbot"                     # Your repository name
GITHUB_USERNAME="your-username"            # Your GitHub username
SITE_DIR="dist"                            # Directory containing your site files
COMMIT_MESSAGE="Deploy AI chatbot updates" # Git commit message

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Function to check if command exists
command_exists() {
  command -v "$1" >/dev/null 2>&1
}

# Check prerequisites
echo -e "${YELLOW}Checking prerequisites...${NC}"

if ! command_exists git; then
  echo -e "${RED}Error: Git is not installed. Please install Git first.${NC}"
  exit 1
fi

if ! command_exists node; then
  echo -e "${YELLOW}Warning: Node.js is not installed. Some features may not work.${NC}"
fi

# Create production build (if using a framework like React/Vue)
echo -e "${YELLOW}Creating production build...${NC}"

if [ -f "package.json" ]; then
  if command_exists npm; then
    npm install
    npm run build
    SITE_DIR="build" # React uses 'build', Vue uses 'dist'
  else
    echo -e "${YELLOW}Warning: package.json found but npm is not installed. Using raw files.${NC}"
  fi
fi

# Initialize Git repository if needed
if [ ! -d ".git" ]; then
  echo -e "${YELLOW}Initializing Git repository...${NC}"
  git init
fi

# Check if GitHub remote exists
if ! git remote | grep -q origin; then
  echo -e "${YELLOW}Adding GitHub remote...${NC}"
  git remote add origin "https://github.com/${GITHUB_USERNAME}/${REPO_NAME}.git"
fi

# Create or clear the gh-pages branch
echo -e "${YELLOW}Preparing gh-pages branch...${NC}"

# Create orphan branch if it doesn't exist
if ! git show-ref --verify --quiet refs/heads/gh-pages; then
  git checkout --orphan gh-pages
  git rm -rf .
else
  git checkout gh-pages
  # Remove all files except .git
  find . -path ./.git -prune -o -exec rm -rf {} + 2>/dev/null
fi

# Copy site files
echo -e "${YELLOW}Copying site files...${NC}"
cp -a "${SITE_DIR}/." .

# Add files to Git
echo -e "${YELLOW}Adding files to Git...${NC}"
git add .

# Commit changes
echo -e "${YELLOW}Committing changes...${NC}"
git commit -m "${COMMIT_MESSAGE}"

# Push to GitHub
echo -e "${YELLOW}Pushing to GitHub...${NC}"
git push origin gh-pages --force

# Switch back to main branch
git checkout main

echo -e "${GREEN}Success! Your AI chatbot site is being deployed to:${NC}"
echo -e "${GREEN}https://${GITHUB_USERNAME}.github.io/${REPO_NAME}/${NC}"

# Open in browser
if command_exists xdg-open; then
  xdg-open "https://${GITHUB_USERNAME}.github.io/${REPO_NAME}/"
elif command_exists open; then
  open "https://${GITHUB_USERNAME}.github.io/${REPO_NAME}/"
fi