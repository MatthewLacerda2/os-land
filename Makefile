# The single task runner. CI calls these exact targets so local and CI cannot
# diverge. Scope your run to the layer you touched.

.PHONY: check backend frontend \
        back-install back-lint back-build back-test \
        front-install front-lint front-build front-test

check: backend frontend

backend: back-lint back-build back-test
frontend: front-lint front-build front-test

# --- Backend (NestJS) -------------------------------------------------------
back-install:
	cd backend && bun install

back-lint:
	cd backend && bun run lint

back-build:
	cd backend && bun run build

back-test:
	cd backend && bun run test

# --- Frontend (React/Vite) --------------------------------------------------
front-install:
	cd frontend && bun install

front-lint:
	cd frontend && bun run lint

front-build:
	cd frontend && bun run build

# No frontend test suite yet; placeholder keeps the gate shape stable.
front-test:
	@echo "front-test: no frontend test suite yet"
