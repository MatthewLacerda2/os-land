import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { EnvironmentService } from './environment-service.entity';

export enum MaintenancePhotoType {
  FRONTAL = 'frontal',
  TICKET = 'ticket',
  CONDENSER = 'condenser',
  FAULT = 'fault',
}

@Entity('maintenance_photos')
export class MaintenancePhoto {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  path: string;

  @Column({
    type: 'enum',
    enum: MaintenancePhotoType,
  })
  label: MaintenancePhotoType;

  @ManyToOne(() => EnvironmentService, (service) => service.photos, { onDelete: 'CASCADE' })
  environmentService: EnvironmentService;
}
