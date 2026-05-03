#!/bin/bash

set -e

SMITH_DIR="$(cd "$(dirname "$0")" && pwd)"

echo "Installing Smith from: $SMITH_DIR"

# 1. Install Node dependencies
echo ""
echo "Installing Node.js dependencies..."
cd "$SMITH_DIR" && npm install

# 2. Install Playwright Chromium browser
echo ""
echo "Installing Playwright Chromium browser..."
npx playwright install chromium

# 3. Register the agent with Claude Code
echo ""
echo "Registering Smith agent with Claude Code..."
mkdir -p ~/.claude/agents
mkdir -p ~/.claude/agents/learnings

# Copy smith.md and replace SMITH_PATH with the actual install directory
sed "s|SMITH_PATH|$SMITH_DIR|g" "$SMITH_DIR/smith.md" > ~/.claude/agents/smith.md

echo ""
echo "Done! Smith is installed at: ~/.claude/agents/smith.md"
echo ""
echo "Next steps:"
echo "  1. Make sure Claude Code has the Atlassian MCP connected"
echo "  2. In Claude Code, run: /agents"
echo "  3. Select 'smith' and give it a white-label app URL to get started"
