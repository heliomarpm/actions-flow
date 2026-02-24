#!/usr/bin/env bash
set -euo pipefail

echo "🚀 Semantic Release Script"

# ------------------------------------------------------------
# Helpers
# ------------------------------------------------------------
log() { echo "→ $1"; }
has_file() { [[ -f "$1" ]]; }

fail() {
  echo "::error::$1"
  exit 1
}


# ------------------------------------------------------------
# Environments
# ------------------------------------------------------------
REUSABLE_PATH="${REUSABLE_PATH:-__reusable_files__}"
STACK="${STACK:-node}"
IS_DRY_RUN="${IS_DRY_RUN:-false}"
IS_DEBUG="${IS_DEBUG:-false}"
IS_STRICT_MODE="${IS_STRICT_MODE:-false}"

# TODO: Gerar o `releaserc.json` dinamicamente (./$STACK/generate-config.sh)
DEFAULT_CONFIG="$REUSABLE_PATH/scripts/plugins/$STACK/releaserc.json"
STRICT_TEMPLATE="$REUSABLE_PATH/.github/templates/commit_strict_error.md"


# ------------------------------------------------------------
# Build semantic-release command
# ------------------------------------------------------------
build_cmd() {
  local CMD="npx semantic-release"
  
  [[ -n "$DEFAULT_CONFIG" ]] && CMD+=" --extends $DEFAULT_CONFIG"
  [[ "$IS_DEBUG" == "true" ]] && CMD+=" --debug"
 
  echo "$CMD" 
}

# ------------------------------------------------------------
# STRICT MODE — Enforce conventional commits
# ------------------------------------------------------------
is_strict_mode() {
  local STRICT_CMD="${1:-npx semantic-release} --dry-run"
  
  echo "===================================================="
  log "Strict mode enabled — validating conventional commits"

  OUTPUT=$(eval "$STRICT_CMD" 2>&1 || true)

  if echo "$OUTPUT" | grep -qiE "no release type found|There are no relevant changes"; then
    summary_strict_mode
    exit 1
  fi

  log "Conventional commits validation passed"
}

summary_strict_mode() {
  # Annotation (curta, visível no PR / Job)
  echo "::error title=RELEASE BLOCKED (STRICT MODE)::No valid Conventional Commits found since the last release. See job summary for instructions."

  {
    echo "# 🚫 Release bloqueada por STRICT MODE"
    echo ""
    echo "**Repositório:** \`$GITHUB_REPOSITORY\`"
    echo "**Branch:** \`${GITHUB_REF_NAME:-unknown}\`"
    echo ""
    echo "❌ Nenhum **Conventional Commit** válido foi encontrado desde o último release."
    echo ""
    echo "---"
  } >> "$GITHUB_STEP_SUMMARY"

  if [[ -f "$STRICT_TEMPLATE" ]]; then
    cat "$STRICT_TEMPLATE" >> "$GITHUB_STEP_SUMMARY"
  else
    echo "📖 Veja [Conventional Commits specification](https://www.conventionalcommits.org)" >> "$GITHUB_STEP_SUMMARY"
  fi

  fail "Release blocked by STRICT MODE: no valid Conventional Commits found"
}

# ------------------------------------------------------------
# Run release
# ------------------------------------------------------------
run() {
  # install dependencies  
  # bash "$REUSABLE_PATH/scripts/shared/semantic-release/install.sh"
  bash "$(dirname "$0")/install.sh"

  local CMD=$(build_cmd)

  if [[ "$IS_STRICT_MODE" == "true" ]]; then
    is_strict_mode "$CMD"
  fi

  if [[ "$IS_DRY_RUN" == "true" || "${GITHUB_EVENT_NAME:-}" == "pull_request" ]]; then
    log "Dry-run enabled"
    CMD+=" --dry-run"
  fi

  echo "===================================================="
  log "running: $CMD"
  eval "$CMD"  
}

run
log "🎉 Done."
