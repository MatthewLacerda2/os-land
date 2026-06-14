#!/bin/bash
# Installs dependencies so the coding agent can run the quality gates
# (`make check`) during Claude Code on the web sessions. There is no
# GitHub-side CI by design (solo project); the gates are run by the agent,
# not on push.
set -euo pipefail

# Only run in Claude Code on the web (remote) sessions; local devs manage
# their own installs.
if [ "${CLAUDE_CODE_REMOTE:-}" != "true" ]; then
  exit 0
fi

cd "$CLAUDE_PROJECT_DIR"

# Idempotent: `bun install` is safe to re-run, and the container state is
# cached after the hook completes. Uses the Makefile install targets so there
# is a single source of truth for how deps are installed.
make back-install front-install
