import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany } from 'typeorm';
import { MaintenanceOrder } from './maintenance-order.entity';
import { Environment } from './environment.entity';
import { MaintenancePhoto } from './maintenance-photo.entity';

@Entity('environment_services')
export class EnvironmentService {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => MaintenanceOrder, (order) => order.environmentServices)
  order: MaintenanceOrder;

  @ManyToOne(() => Environment, (env) => env.services)
  environment: Environment;

  @OneToMany(() => MaintenancePhoto, (photo) => photo.environmentService)
  photos: MaintenancePhoto[];
}
