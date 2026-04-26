import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { EnvironmentService } from './environment-service.entity';
import { EnvironmentPhoto } from './environment-photo.entity';

export enum DesignatedSystem {
  SPLIT = 'split',
  SELF = 'self',
  SPLITAO = 'splitao',
}

export enum ProtocolType {
  CORRECTIVE = 'corrective',
  PREVENTIVE = 'preventive',
}

@Entity('environments')
export class Environment {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column({
    type: 'enum',
    enum: DesignatedSystem,
    name: 'designated_system',
  })
  designatedSystem: DesignatedSystem;

  @Column({
    type: 'enum',
    enum: ProtocolType,
    name: 'protocol_type',
  })
  protocolType: ProtocolType;

  @Column({ type: 'text', nullable: true })
  description: string;

  @OneToMany(() => EnvironmentService, (envService) => envService.environment)
  services: EnvironmentService[];

  @OneToMany(() => EnvironmentPhoto, (photo) => photo.environment)
  photos: EnvironmentPhoto[];
}
