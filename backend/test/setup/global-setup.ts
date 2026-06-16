/**
 * Jest globalSetup: boots a throwaway PostgreSQL cluster for the test run.
 *
 * The project's tests run against a *real* Postgres (no mocked repositories) so
 * the repository layer is exercised against actual SQL. Docker is not available
 * in every environment, so instead of a container we spin up a local cluster
 * with the `initdb`/`pg_ctl` binaries that ship with the Postgres install.
 *
 * Connection details are exported via `process.env` (TypeORM reads them in
 * `test/setup/test-db.ts`). globalSetup runs in the main process *before* Jest
 * forks its workers, so these vars are inherited by every test suite.
 */
import { execFileSync } from 'child_process';
import {
  chownSync,
  existsSync,
  mkdtempSync,
  readdirSync,
  writeFileSync,
} from 'fs';
import { tmpdir } from 'os';
import { join } from 'path';

const STATE_FILE = join(tmpdir(), 'os-land-pg-test-state.json');
const PG_PORT = process.env.TEST_DB_PORT ?? '54330';
const PG_USER = 'postgres';
const PG_DB = 'os_land_test';

// Postgres refuses to run as root. When the test process is root (e.g. CI
// containers), drop privileges to the `postgres` OS user via `runuser`.
const RUN_AS_POSTGRES = (process.getuid?.() ?? -1) === 0;

/** Run a Postgres binary, dropping to the `postgres` user when we are root. */
function pgExec(command: string, args: string[]): void {
  if (RUN_AS_POSTGRES) {
    execFileSync('runuser', ['-u', PG_USER, '--', command, ...args], {
      stdio: 'ignore',
    });
  } else {
    execFileSync(command, args, { stdio: 'ignore' });
  }
}

/**
 * Locate the Postgres server binaries. The client tools (`psql`) are usually on
 * PATH, but the server tools (`initdb`, `pg_ctl`) live under a versioned dir on
 * Debian/Ubuntu. Pick the highest installed version; fall back to PATH.
 */
function resolvePgBinDir(): string {
  const base = '/usr/lib/postgresql';
  if (existsSync(base)) {
    const versions = readdirSync(base)
      .map((entry) => Number.parseInt(entry, 10))
      .filter((version) => !Number.isNaN(version))
      .sort((a, b) => b - a);
    for (const version of versions) {
      const dir = join(base, String(version), 'bin');
      if (existsSync(join(dir, 'initdb'))) {
        return dir;
      }
    }
  }
  return '';
}

export default function globalSetup(): void {
  const binDir = resolvePgBinDir();
  const bin = (name: string): string => (binDir ? join(binDir, name) : name);
  const dataDir = mkdtempSync(join(tmpdir(), 'os-land-pgdata-'));

  // mkdtemp makes the dir root-owned; hand it to the postgres user so it can
  // initialise and write the cluster there.
  if (RUN_AS_POSTGRES) {
    chownSync(
      dataDir,
      Number.parseInt(
        execFileSync('id', ['-u', PG_USER], { encoding: 'utf8' }).trim(),
        10,
      ),
      Number.parseInt(
        execFileSync('id', ['-g', PG_USER], { encoding: 'utf8' }).trim(),
        10,
      ),
    );
  }

  // trust auth keeps the suite password-free; the cluster is local and ephemeral
  pgExec(bin('initdb'), [
    '-D',
    dataDir,
    '-U',
    PG_USER,
    '-A',
    'trust',
    '-E',
    'UTF8',
    '--no-sync',
  ]);

  pgExec(bin('pg_ctl'), [
    '-D',
    dataDir,
    '-w',
    '-o',
    `-p ${PG_PORT} -c listen_addresses=127.0.0.1 -c unix_socket_directories=${dataDir} -c fsync=off`,
    '-l',
    join(dataDir, 'server.log'),
    'start',
  ]);

  pgExec(bin('createdb'), [
    '-h',
    '127.0.0.1',
    '-p',
    PG_PORT,
    '-U',
    PG_USER,
    PG_DB,
  ]);

  process.env.DB_HOST = '127.0.0.1';
  process.env.DB_PORT = PG_PORT;
  process.env.DB_USERNAME = PG_USER;
  process.env.DB_PASSWORD = '';
  process.env.DB_NAME = PG_DB;
  process.env.JWT_SECRET ??= 'test-secret';

  // Hand the cluster location to globalTeardown (separate process, no shared vars)
  writeFileSync(STATE_FILE, JSON.stringify({ dataDir, binDir, port: PG_PORT }));
}
