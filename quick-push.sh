#!/bin/bash
# Quick push script for webfinder-ai
# Usage: ./quick-push.sh "your commit message"

COMMIT_MSG="${1:-"Update: $(date '+%Y-%m-%d %H:%M')"}"

echo "🚀 Pushing to GitHub..."
git add .
git commit -m "$COMMIT_MSG"
git push origin main

echo "✅ Done! Check: https://github.com/brank493-ui/webfinder-ai"
