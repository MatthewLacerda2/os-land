import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { EnvironmentService } from './environment-service.entity';
import { DesignatedSystem } from './environment.enums';

// Re-exported for backward compatibility with existing imports.
export { DesignatedSystem, ProtocolType } from './environment.enums';

@Entity('environments')
export class Environment {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({
    type: 'enum',
    enum: DesignatedSystem,
    name: 'designated_system',
  })
  designatedSystem: DesignatedSystem;

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column({
    type: 'decimal',
    name: 'set_point',
    nullable: true,
    precision: 5,
    scale: 2,
  })
  setPoint: number;

  @OneToMany(() => EnvironmentService, (envService) => envService.environment)
  services: EnvironmentService[];
}
