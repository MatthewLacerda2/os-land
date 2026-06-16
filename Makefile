# Single task runner for every quality gate. There is no GitHub-side CI by
# design (solo project); the coding agent runs `make check` before pushing, so
# the gates live in one place and never drift.
# Everything is driven by Bun. Override with: make check BUN=bun

BUN ?= bun

.DEFAULT_GOAL := check

# ---------------------------------------------------------------------------
# Aggregate gates
# ---------------------------------------------------------------------------
.PHONY: check backend frontend
check: backend frontend

backend: back-lint back-build back-test
frontend: front-lint front-build front-test

# ---------------------------------------------------------------------------
# Backend gates  (run from backend/, driven by $(BUN))
# ---------------------------------------------------------------------------
.PHONY: back-lint back-build back-test back-install
back-lint:
	cd backend && $(BUN) run lint

back-build:
	cd backend && $(BUN) run build

# --passWithNoTests keeps the gate green even if every spec is later removed.
# Spec files boot a throwaway Postgres cluster via test/setup/global-setup.ts.
back-test:
	cd backend && $(BUN) run test -- --passWithNoTests

back-install:
	cd backend && $(BUN) install

# ---------------------------------------------------------------------------
# Frontend gates  (run from frontend/, driven by $(BUN))
# ---------------------------------------------------------------------------
.PHONY: front-lint front-build front-test front-install
front-lint:
	cd frontend && $(BUN) run lint

front-build:
	cd frontend && $(BUN) run build

# No frontend test script yet; placeholder keeps the gate green until tests exist.
front-test:
	@echo "no frontend tests yet"

front-install:
	cd frontend && $(BUN) install
