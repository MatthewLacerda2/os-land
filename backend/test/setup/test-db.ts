/**
 * Shared helpers for DB-backed unit tests. Each suite builds a Nest testing
 * module that connects to the throwaway Postgres cluster from `global-setup.ts`
 * and lets TypeORM `synchronize` create the schema. Per-test isolation is
 * handled by the transactional-rollback harness (see `transactional.ts`).
 */
import { TypeOrmModule } from '@nestjs/typeorm';
import type { DynamicModule } from '@nestjs/common';
import { EnvironmentService } from '../../src/entities/environment-service.entity';
import { Environment } from '../../src/entities/environment.entity';
import { MaintenanceOrder } from '../../src/entities/maintenance-order.entity';
import { MaintenancePhoto } from '../../src/entities/maintenance-photo.entity';
import { User } from '../../src/entities/user.entity';

export const TEST_ENTITIES = [
  User,
  MaintenanceOrder,
  Environment,
  EnvironmentService,
  MaintenancePhoto,
];

/** TypeORM root module pointed at the ephemeral test cluster. */
export function testTypeOrmRoot(): DynamicModule {
  return TypeOrmModule.forRoot({
    type: 'postgres',
    host: process.env.DB_HOST,
    port: Number.parseInt(process.env.DB_PORT ?? '5432', 10),
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    entities: TEST_ENTITIES,
    synchronize: true,
  });
}
