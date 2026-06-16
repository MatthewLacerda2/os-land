/**
 * Per-test transactional isolation — the TypeORM equivalent of SQLAlchemy's
 * "begin a transaction, run the test, roll back" pattern.
 *
 * The catch: injected repositories use the DataSource's default manager, and
 * the maintenance service opens its own `dataSource.transaction()`. Both pull a
 * fresh QueryRunner from the pool, so a naive outer transaction wouldn't see
 * them. We pin `createQueryRunner` to a single shared, already-in-transaction
 * runner and neutralise its `release()`, so every operation runs on one
 * connection. Nested `startTransaction()` calls degrade to SAVEPOINTs, and the
 * outer `rollback()` discards the whole test's writes.
 */
import type { DataSource, QueryRunner } from 'typeorm';

export interface RollbackContext {
  begin(): Promise<void>;
  rollback(): Promise<void>;
}

export function useTransactionalRollback(
  dataSource: DataSource,
): RollbackContext {
  const realCreateQueryRunner = dataSource.createQueryRunner.bind(
    dataSource,
  ) as DataSource['createQueryRunner'];
  let runner: QueryRunner | null = null;

  return {
    async begin(): Promise<void> {
      const shared = realCreateQueryRunner();
      await shared.connect();
      await shared.startTransaction();
      // App code must not return this connection to the pool mid-test.
      shared.release = (): Promise<void> => Promise.resolve();
      dataSource.createQueryRunner = (): QueryRunner => shared;
      runner = shared;
    },

    async rollback(): Promise<void> {
      dataSource.createQueryRunner = realCreateQueryRunner;
      if (!runner) {
        return;
      }
      if (runner.isTransactionActive) {
        await runner.rollbackTransaction();
      }
      // Restore the prototype release(), then hand the connection back.
      delete (runner as { release?: QueryRunner['release'] }).release;
      await runner.release();
      runner = null;
    },
  };
}
