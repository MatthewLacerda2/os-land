import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
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

  @Column({ name: 'agency_name', nullable: true })
  agencyName: string;

  @Column()
  state: string;

  @Column({ nullable: true })
  company: string;

  @Column({ name: 'asset_number', nullable: true })
  assetNumber: string;

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column({
    type: 'enum',
    enum: ['corrective', 'preventive'],
    name: 'protocol_type',
    default: 'corrective',
  })
  protocolType: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @Column('simple-array', { nullable: true, name: 'initial_photos' })
  initialPhotos: string[];

  @ManyToOne(() => User, (user) => user.orders)
  @JoinColumn({ name: 'technicianId' })
  creator: User;

  @OneToMany(() => EnvironmentService, (envService: EnvironmentService) => envService.order)
  environmentServices: EnvironmentService[];
}
