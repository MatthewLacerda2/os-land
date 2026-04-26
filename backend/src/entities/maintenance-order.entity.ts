import { Column, CreateDateColumn, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { EnvironmentService } from './environment-service.entity';
import { User } from './user.entity';

@Entity()
export class MaintenanceOrder {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  osNumber: string;

  @Column()
  latitude: string;

  @Column()
  longitude: string;

  @Column()
  location: string;

  @Column()
  company: string;

  @Column({ type: 'text', nullable: true })
  description: string;

  @CreateDateColumn()
  createdAt: Date;

  @Column('simple-array', { nullable: true })
  initialPhotos: string[];

  @ManyToOne(() => User, (user) => user.orders)
  technician: User;

  @OneToMany(() => EnvironmentService, (envService: EnvironmentService) => envService.order)
  environmentServices: EnvironmentService[];
}
