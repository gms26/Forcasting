#!/bin/bash
echo "Cleaning up git repository..."

# Remove pycache from git tracking
git rm -r --cached backend/forecasting/__pycache__ 2>/dev/null || true
git rm -r --cached backend/llm/__pycache__ 2>/dev/null || true
git rm -r --cached backend/utils/__pycache__ 2>/dev/null || true
git rm -r --cached backend/tests/__pycache__ 2>/dev/null || true

# Remove database file from git tracking
git rm --cached backend/utils/users.db 2>/dev/null || true

# Remove JS file from git tracking  
git rm --cached backend/generate_sample.js 2>/dev/null || true

# Stage all changes
git add .

# Commit cleanup
git commit -m "fix: remove pycache, db files, cleanup gitignore"

# Push to main
git push origin main

echo "Git cleanup complete!"
