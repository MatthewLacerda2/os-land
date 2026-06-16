/**
 * Jest globalTeardown: stops and removes the throwaway Postgres cluster that
 * `global-setup.ts` started. Reads the cluster location from the state file the
 * setup wrote, since setup and teardown run in separate processes.
 */
import { execFileSync } from 'child_process';
import { existsSync, readFileSync, rmSync } from 'fs';
import { tmpdir } from 'os';
import { join } from 'path';

const STATE_FILE = join(tmpdir(), 'os-land-pg-test-state.json');

interface ClusterState {
  dataDir: string;
  binDir: string;
  port: string;
}

export default function globalTeardown(): void {
  if (!existsSync(STATE_FILE)) {
    return;
  }

  const state = JSON.parse(readFileSync(STATE_FILE, 'utf8')) as ClusterState;
  const bin = (name: string): string =>
    state.binDir ? join(state.binDir, name) : name;
  const runAsPostgres = (process.getuid?.() ?? -1) === 0;
  const stopArgs = ['-D', state.dataDir, '-m', 'immediate', '-w', 'stop'];

  try {
    if (runAsPostgres) {
      execFileSync(
        'runuser',
        ['-u', 'postgres', '--', bin('pg_ctl'), ...stopArgs],
        {
          stdio: 'ignore',
        },
      );
    } else {
      execFileSync(bin('pg_ctl'), stopArgs, { stdio: 'ignore' });
    }
  } catch {
    // Cluster already down — nothing to stop.
  }

  rmSync(state.dataDir, { recursive: true, force: true });
  rmSync(STATE_FILE, { force: true });
}
