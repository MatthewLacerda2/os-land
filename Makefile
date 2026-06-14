# Single task runner. CI invokes these exact targets so local and CI never drift.
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

# jest has no spec files yet; --passWithNoTests keeps the gate green until tests exist.
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
