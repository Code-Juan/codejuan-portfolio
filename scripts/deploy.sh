#!/usr/bin/env bash
#
# Build codejuan.com (portfolio) from this Astro workspace and publish it to the
# GitHub Pages repo `Code-Juan/Code-Juan.github.io` (checked out at ../portfolio).
#
# Mirrors the services deploy: build locally, copy dist/ into the existing Pages repo,
# commit + push. build.format:'file' keeps routes flat; CNAME + .nojekyll ship from public/.
#
# Usage (run from Git Bash):
#   bash scripts/deploy.sh            # build, show the diff, confirm, then push
#   bash scripts/deploy.sh --yes      # skip the confirmation prompt
#   bash scripts/deploy.sh --build-only   # build + stage into ../portfolio, do not commit/push
#
set -euo pipefail

WEB_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
PAGES_REPO="$(cd "$WEB_ROOT/../portfolio" && pwd)"
EXPECTED_REMOTE="Code-Juan/Code-Juan.github.io"
PUSH_BRANCH="${PUSH_BRANCH:-$(git -C "$PAGES_REPO" symbolic-ref --short HEAD 2>/dev/null || echo main)}"

AUTO_YES=0
BUILD_ONLY=0
for arg in "$@"; do
  case "$arg" in
    --yes|-y) AUTO_YES=1 ;;
    --build-only) BUILD_ONLY=1 ;;
    *) echo "unknown option: $arg" >&2; exit 2 ;;
  esac
done

echo "==> Target Pages repo: $PAGES_REPO (branch: $PUSH_BRANCH)"

# Safety: refuse to publish into the wrong repo. Match owner/repo case-insensitively,
# accepting both https (github.com/Code-Juan/...) and ssh (github.com:Code-Juan/...) forms.
remote_url="$(git -C "$PAGES_REPO" remote get-url origin 2>/dev/null || true)"
if [[ "$(printf '%s' "$remote_url" | tr 'A-Z' 'a-z')" != *"code-juan/code-juan.github.io"* ]]; then
  echo "ERROR: $PAGES_REPO origin is '$remote_url', expected to contain '$EXPECTED_REMOTE'. Aborting." >&2
  exit 1
fi

# 1) Build.
echo "==> Building (astro build)..."
cd "$WEB_ROOT"
npm run build

# 2) Guard the two GitHub Pages gotchas before we touch the live repo.
[[ -f "$WEB_ROOT/dist/.nojekyll" ]] || { echo "ERROR: dist/.nojekyll missing (Jekyll would drop the _astro/ assets). Aborting." >&2; exit 1; }
[[ -f "$WEB_ROOT/dist/CNAME" ]]     || { echo "ERROR: dist/CNAME missing (custom domain would break). Aborting." >&2; exit 1; }
grep -qx "codejuan.com" "$WEB_ROOT/dist/CNAME" || { echo "ERROR: dist/CNAME is not codejuan.com. Aborting." >&2; exit 1; }

# 3) Replace the repo contents (everything except git metadata) with the fresh build.
#    -name '.git*' preserves .git plus any .gitignore/.gitattributes/.github the repo may gain.
echo "==> Syncing dist/ -> $PAGES_REPO ..."
find "$PAGES_REPO" -mindepth 1 -maxdepth 1 -not -name '.git*' -exec rm -rf {} +
cp -R "$WEB_ROOT/dist/." "$PAGES_REPO/"

# 4) Stage and show what changed.
cd "$PAGES_REPO"
git add -A
if git diff --cached --quiet; then
  echo "==> No changes to deploy. Done."
  exit 0
fi
echo "==> Changes staged for $EXPECTED_REMOTE:"
git diff --cached --stat

if [[ "$BUILD_ONLY" -eq 1 ]]; then
  echo "==> --build-only: staged in $PAGES_REPO, not committing. Review, then commit/push manually."
  exit 0
fi

# 5) Confirm (production site — real visitors) unless --yes.
if [[ "$AUTO_YES" -ne 1 ]]; then
  read -r -p "Push these changes live to codejuan.com? [y/N] " reply || reply=""
  [[ "$reply" == "y" || "$reply" == "Y" ]] || { echo "Aborted; nothing pushed. Working tree in $PAGES_REPO is staged."; exit 0; }
fi

src_sha="$(git -C "$WEB_ROOT" rev-parse --short HEAD 2>/dev/null || echo 'nogit')"
git commit -m "Deploy codejuan.com from codejuan-portfolio (src $src_sha)"
git push origin "$PUSH_BRANCH"
echo "==> Pushed to $PUSH_BRANCH. GitHub Pages usually updates in 1-3 min. Verify the live site."
