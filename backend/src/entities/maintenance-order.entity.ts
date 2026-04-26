import { Column, CreateDateColumn, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { EnvironmentService } from './environment-service.entity';
import { User } from './user.entity';

@Entity('maintenance_orders')
export class MaintenanceOrder {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'os_number', unique: true })
  osNumber: string;

  @Column()
  latitude: string;

  @Column()
  longitude: string;

  @Column()
  agency: string;

  @Column()
  state: string;

  @Column()
  company: string;

  @Column({ type: 'text', nullable: true })
  description: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @Column('simple-array', { nullable: true, name: 'initial_photos' })
  initialPhotos: string[];

  @ManyToOne(() => User, (user) => user.orders)
  technician: User;

  @OneToMany(() => EnvironmentService, (envService: EnvironmentService) => envService.order)
  environmentServices: EnvironmentService[];
}
