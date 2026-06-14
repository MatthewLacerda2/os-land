# CLAUDE.md — the contract

OS-Land is an HVAC maintenance service-order app (see [`README.md`](./README.md)
for the domain). This file is the operating contract for anyone — human or
agent — working in the repo. The conventions below are meant to be **enforced by
gates, not by memory**: a linter rule or a config that fails the build is
preferred over prose asking you to remember.

## Working agreement

Any rule here can be overridden by an explicit user instruction in the current
or a previous prompt.

- **Never commit or push** unless the user asked you to.
- **Foundations first.** Establish the architecture and quality gates before
  building features on top of them.
- **Shared understanding before code.** If a request is ambiguous, clarify
  before building — don't guess.
- **Push back on dead weight.** If something doesn't add value, say so; if
  something can be removed without losing value, suggest it.
- **Prefer expression over description.** Encode a convention as a lint rule or
  config rather than documenting that it exists.
- **Don't multiply Markdown.** Don't add new `.md` files without asking; you may
  edit existing ones (and say what you changed).

## The no-drift meta-pattern

One `Makefile` defines every quality gate, and **CI runs those exact targets**,
so local and CI can never diverge. Never add a check that only runs in one place.

```
make check      # everything
make backend    # back-lint + back-build + back-test
make frontend   # front-lint + front-build + front-test
```

Gates must be green before you push. Scope your run to the layer you touched.

## Repository layout

```
backend/
  src/
    <domain>/
      *.controller.ts        # HTTP handlers — thin: parse, delegate, shape response
      *.service.ts           # business logic + transaction boundaries
      *.repository.ts        # the ONLY place TypeORM queries live
      dto/                   # class-validator request/response contracts
    entities/                # TypeORM ORM models
    auth/                    # JWT strategy, guards, decorators
    common/                  # cross-cutting: logging, filters, config
frontend/
  src/
    pages/                   # route screens — never call the network directly
    components/
      ui/                    # shadcn primitives (vendored; exempt from house rules)
      <route-path>/          # project-specific components, mirroring the app routes
    api/                     # client.ts (auth lives here) + per-domain SDK modules
    store/                   # Zustand stores
    index.css                # the design system: semantic tokens only
Makefile                     # the single task runner; CI calls these targets
```

## Backend rules

- **Layer separation (non-negotiable):**
  `controller` → `service` → `repository` → `entity`, with DTOs as the I/O
  contract.
- **DB access is forbidden anywhere except `*.repository.ts`.** No
  `Repository<T>`, `QueryBuilder`, or `DataSource` query in a controller,
  service, util, or guard. Services compose repository calls and own the
  transaction boundary.
- **Validation is strict.** The global `ValidationPipe` uses
  `whitelist: true` + `transform: true`; every request/response is a DTO.
  Throw Nest HTTP exceptions (`ConflictException`, `BadRequestException`, …),
  never bare `Error`.
- **Auth.** Global `JwtAuthGuard` (secure by default); `@Public()` opts out,
  `@Roles()` gates by role. Trust identity from the JWT (`req.user`), never
  from the request body. `JWT_SECRET` is required — the app fails fast if it
  is missing.
- **Length limits** (enforced by ESLint): file ≤ 350 lines,
  function/method ≤ 50 lines.

## Frontend rules

- **Pages never `fetch`.** `pages/` → `src/api/<domain>.ts` →
  `src/api/client.ts`. `client.ts` is the single place token handling lives.
- **Design-system compliance:**
  - **Compose `components/ui/**` (shadcn) primitives**; never hand-roll a raw
    `<input>` / `<select>` / `<textarea>`. Add primitives with
    `bunx shadcn@latest add <name>`.
  - **Color is an allowlist.** Only semantic tokens defined in `index.css`
    (`bg-primary`, `text-muted-foreground`, …). No raw palette classes
    (`bg-blue-500`), no hex / `rgb()` literals in `className` / `style`.
  - **One exported component per file** (`components/ui/**` exempt).
  - `max-lines: 550` per `.ts` / `.tsx`.
- **Project-specific components mirror the route structure.** A component used
  only by `/service/new` lives under `components/service/new/`, etc. Anything
  shared across routes is hoisted to the nearest common ancestor.

## Tooling

- **Bun** is the package manager and build tool; lockfiles are committed and
  Docker builds use `--frozen-lockfile`.
- **Prettier** formats both layers; a Husky pre-commit hook runs lint-staged.
- **Do not auto-start** dev servers or `docker compose up` to "check" something
  — use the build/test gates. If a human needs a running app, ask them to start
  it.

## Language & i18n

- All **code, comments, and docs are English**.
- User-facing strings are **Portuguese**, hardcoded. The app is for the
  Brazilian market only; there is intentionally **no i18n layer**.

## Intentionally deferred (known upgrade paths)

- **JWT expiry / refresh** — tokens currently never expire by request.
- **Migrations** — TypeORM `synchronize: true` for now; add migrations when
  schema changes must be ordered/destructive.
- **Real PDF report** — the report endpoint is a stub.
- **Backend tests** — structure is testable; suites come later.
