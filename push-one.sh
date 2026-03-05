#!/bin/bash
# ============================================================
# DefendML — Push a single file to GitHub via git over HTTPS
# Usage:
#   cd ~/defendml-coworker
#   bash push-one.sh src/pages/onboarding.tsx "Add self-serve onboarding wizard"
#
# Token resolution order:
#   1. GITHUB_TOKEN env var
#   2. ~/.defendml-token file
# ============================================================

REPO="dsovan2004-beep/defendml-app"
SCAFFOLD="$(cd "$(dirname "$0")" && pwd)/defendml-app"
BRANCH="main"
TMP_DIR="/tmp/defendml-git-push"

GREEN='\033[0;32m'
RED='\033[0;31m'
CYAN='\033[0;36m'
NC='\033[0m'

# ── Resolve token ─────────────────────────────────────────
if [ -n "$GITHUB_TOKEN" ]; then
  TOKEN="$GITHUB_TOKEN"
elif [ -f "$HOME/.defendml-token" ]; then
  TOKEN=$(cat "$HOME/.defendml-token" | tr -d '[:space:]')
else
  echo -e "${RED}❌ No token found. Set GITHUB_TOKEN env var or create ~/.defendml-token${NC}"
  exit 1
fi

# ── Args ──────────────────────────────────────────────────
FILE_PATH="$1"
COMMIT_MSG="$2"

if [ -z "$FILE_PATH" ]; then
  echo -e "${RED}Usage: bash push-one.sh <file-path> \"commit message\"${NC}"
  echo -e "Example: bash push-one.sh src/pages/onboarding.tsx \"Add onboarding wizard\""
  exit 1
fi

if [ -z "$COMMIT_MSG" ]; then
  COMMIT_MSG="Update $FILE_PATH"
fi

FULL_PATH="$SCAFFOLD/$FILE_PATH"

if [ ! -f "$FULL_PATH" ]; then
  echo -e "${RED}❌ File not found: $FULL_PATH${NC}"
  exit 1
fi

REMOTE="https://dsovan2004-beep:$TOKEN@github.com/$REPO.git"

# ── Clone or reuse repo ───────────────────────────────────
echo -e "${CYAN}📡 Syncing repo...${NC}"
if [ -d "$TMP_DIR/.git" ]; then
  GIT_TERMINAL_PROMPT=0 git -C "$TMP_DIR" pull --quiet "$REMOTE" "$BRANCH" 2>&1
else
  rm -rf "$TMP_DIR"
  GIT_TERMINAL_PROMPT=0 git clone --depth=1 --quiet "$REMOTE" "$TMP_DIR" 2>&1
fi

if [ $? -ne 0 ]; then
  echo -e "${RED}❌ Failed to sync repo${NC}"
  exit 1
fi

# ── Copy file ─────────────────────────────────────────────
echo -e "${CYAN}📋 Copying: $FILE_PATH${NC}"
mkdir -p "$TMP_DIR/$(dirname "$FILE_PATH")"
cp "$FULL_PATH" "$TMP_DIR/$FILE_PATH"

# ── Commit ────────────────────────────────────────────────
git -C "$TMP_DIR" config user.email "deploy@defendml.com"
git -C "$TMP_DIR" config user.name "DefendML Deploy"
git -C "$TMP_DIR" add "$FILE_PATH"

if git -C "$TMP_DIR" diff --cached --quiet; then
  echo -e "${GREEN}✅ No changes to commit — file already up to date${NC}"
  exit 0
fi

git -C "$TMP_DIR" commit -m "$COMMIT_MSG" --quiet

# ── Push ──────────────────────────────────────────────────
echo -e "${CYAN}🚀 Pushing: $FILE_PATH${NC}"
GIT_TERMINAL_PROMPT=0 git -C "$TMP_DIR" push "$REMOTE" "$BRANCH" 2>&1

if [ $? -eq 0 ]; then
  COMMIT_SHA=$(git -C "$TMP_DIR" rev-parse --short HEAD)
  echo -e "${GREEN}✅ Done — commit $COMMIT_SHA, 1 build triggered${NC}"
  echo -e "${GREEN}   https://github.com/$REPO${NC}"
else
  echo -e "${RED}❌ Push failed${NC}"
  exit 1
fi
