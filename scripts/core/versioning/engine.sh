# #!/usr/bin/env bash
# set -euo pipefail

# MODE="$1"                 # validate | preview | publish
# STRICT="${STRICT_CONVENTIONAL:-false}"

# ROOT="$(git rev-parse --show-toplevel)"
# OUT="$ROOT/.github/__versioning__/versioning-result.json"

# mkdir -p "$(dirname "$OUT")"

# # node "$REUSABLE_PATH/scripts/core/versioning/versioning.js" \
# node "$(dirname "$0")/versioning.js" \
#   --mode "$MODE" \
#   --strict "$STRICT" \
#   --output "$OUT"

# echo "versioning_file=$OUT" >> "$GITHUB_OUTPUT"

#!/usr/bin/env bash
set -euo pipefail

MODE="${1:-validate}" # validate | preview | publish
STRICT="${STRICT_CONVENTIONAL:-false}"

ROOT="$(git rev-parse --show-toplevel)"
OUT_DIR="$ROOT/.github/__versioning__"
OUT_FILE="$OUT_DIR/versioning-result.json"

mkdir -p "$OUT_DIR"

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

pushd "$SCRIPT_DIR" >/dev/null

if [ ! -d "node_modules" ]; then
  npm install --silent
fi

node versioning.js \
  --mode="$MODE" \
  --strict="$STRICT" \
  --output="$OUT_FILE"

popd >/dev/null

echo "versioning_file=$OUT_FILE" >> "$GITHUB_OUTPUT"