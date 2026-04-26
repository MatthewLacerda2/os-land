import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { MaintenanceOrder } from './maintenance-order.entity';
import { Environment } from './environment.entity';

@Entity('environment_services')
export class EnvironmentService {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => MaintenanceOrder, (order) => order.environmentServices)
  order: MaintenanceOrder;

  @ManyToOne(() => Environment, (env) => env.services)
  environment: Environment;

  @Column('simple-array', { nullable: true, name: 'verification_photos' })
  verificationPhotos: string[];
}
