import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EnvironmentService } from '../entities/environment-service.entity';
import { Environment } from '../entities/environment.entity';
import { MaintenanceOrder } from '../entities/maintenance-order.entity';
import { MaintenancePhoto } from '../entities/maintenance-photo.entity';
import { User } from '../entities/user.entity';
import { MaintenanceController } from './maintenance.controller';
import { MaintenanceRepository } from './maintenance.repository';
import { MaintenanceService } from './maintenance.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      MaintenanceOrder,
      Environment,
      EnvironmentService,
      MaintenancePhoto,
      User,
    ]),
  ],
  controllers: [MaintenanceController],
  providers: [MaintenanceService, MaintenanceRepository],
})
export class MaintenanceModule {}
