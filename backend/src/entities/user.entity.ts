import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { MaintenanceOrder } from './maintenance-order.entity';

export enum UserRole {
  MANAGER = 'manager',
  TECHNICIAN = 'technician',
}

@Entity()
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  email: string;

  @Column()
  password: string;

  @Column()
  name: string;

  @Column({
    type: 'enum',
    enum: UserRole,
    default: UserRole.TECHNICIAN,
  })
  role: UserRole;

  @OneToMany(() => MaintenanceOrder, (order) => order.technician)
  orders: MaintenanceOrder[];
}
