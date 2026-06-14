# OS-Land

OS-Land is a system for registering **HVAC (air-conditioning) maintenance
service orders** — *Ordens de Serviço* — in the field. It is built for
field technicians and their managers at an air-conditioning maintenance
company operating in Brazil, so all user-facing copy is in Portuguese.

> This README summarizes the **business problem** and the **architecture**.
> The operating contract for anyone working in the repo (human or agent) lives
> in [`CLAUDE.md`](./CLAUDE.md).

## The problem we are solving

A technician goes on site to service air-conditioning equipment and needs to
produce a documented, photo-backed record of the work. OS-Land replaces the
paper/WhatsApp workflow with a structured, mobile-first app:

1. **Login.** A registered user signs in. There are two roles:
   - **Manager** — creates other users (technicians and managers). A root
     manager is seeded on first boot from environment variables.
   - **Technician** — creates and views their own service orders.
2. **See your orders.** The home screen lists the service orders the user is
   responsible for (managers see all), most recent first.
3. **Open a new service order.** An order captures the job's identity and
   location: OS number, agency / agency name, state, company, asset number,
   GPS coordinates, a free-text description, and a protocol type
   (**preventive** or **corrective**).
4. **Add environments (equipment).** An order contains one or more
   *environments*. An environment is **a single piece of equipment plus the
   maintenance performed on it**: the designated system (split / self /
   splitão), a description of the equipment and the repair, an optional set
   point, and **evidence photos** (at least two per environment).
5. **Review and submit.** The technician reviews the assembled order and
   submits it; the equipment photos are uploaded and the order is persisted
   transactionally (if the DB write fails, the uploaded files are rolled back
   off disk).
6. **Complete and report.** On finishing the service, the technician can
   generate a **PDF report** of the order and export / share it.

### Domain model

```
User (manager | technician)
  └─ MaintenanceOrder (OS number, location, description, protocol type)
        └─ EnvironmentService            # links an order to one equipment
              ├─ Environment             # the equipment + its maintenance
              └─ MaintenancePhoto[]      # evidence photos for that equipment
```

## Architecture

**Backend — NestJS, layered, database access isolated to repositories:**

```
controllers (HTTP)  →  dto/ (validation contract)  →  repositories (DB)  →  entities (ORM)
                              ↘ services (business logic / orchestration) ↗
```

- Controllers parse input, call services, and shape the response.
- **The database is touched in `repositories/` and nowhere else** — no
  TypeORM query lives in a controller, service, or util. Services own the
  transaction boundary and the business rules.
- DTOs (`class-validator`) are the contract for every request and response.
- Auth is single-tenant JWT (`passport-jwt`); passwords are bcrypt-hashed.
  A global guard makes every route authenticated by default; `@Public()`
  opts a route out, and `@Roles()` gates by role.

**Frontend — React + Vite, SDK-layered, pages never call the network directly:**

```
pages/routes  →  src/api/<domain>.ts  →  src/api/client.ts (the one place auth/token lives)
```

- A page calls the typed API module, which calls the single axios `client`
  where the JWT is attached.
- The **design system is an allowlist**: only semantic color tokens and a
  typography scale defined in `src/index.css` are valid — raw Tailwind palette
  classes and hex/`rgb()` literals fail lint. UI is composed from
  **shadcn** primitives in `components/ui/`; project-specific components live
  in a folder structure that mirrors the app's routes. One exported component
  per file.
- Cross-request UI state lives in a Zustand store.

## Layout

```
backend/    NestJS 11 · TypeORM · PostgreSQL · Passport JWT · class-validator · Swagger
frontend/   React 19 · Vite · Tailwind v4 · shadcn · Zustand · React Router · axios
docker-compose.yml   postgres + backend + nginx-served frontend, all health-checked
Makefile             the single task runner; CI invokes these same targets
CLAUDE.md            the operating contract & conventions
```

## Getting started

```sh
cp .env.example .env
python envcopy.py          # fan the root .env out to backend/ and frontend/

docker compose up --build  # postgres + backend (:3000) + frontend (:80)
```

API docs (Swagger) are served at `http://localhost:3000/api/docs`.

## Intentional non-goals (documented upgrade paths)

The prototype deliberately stops short in a few places so the upgrade is a
known step rather than a rewrite:

- **JWT never expires** (`ignoreExpiration`) — there is no refresh/revocation
  flow yet, by design while in prototype.
- **Schema sync** uses TypeORM `synchronize: true` (additive) — add migrations
  when schema changes need to be ordered/destructive.
- **The PDF report endpoint is a stub** — wire up real PDF generation later.
- **No backend tests yet** — the structure (repositories, DI) is built to be
  testable when we add them.
