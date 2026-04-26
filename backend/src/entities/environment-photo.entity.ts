import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Environment } from './environment.entity';

@Entity('environment_photos')
export class EnvironmentPhoto {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  path: string;

  @Column()
  label: string;

  @ManyToOne(() => Environment, (env) => env.photos, { onDelete: 'CASCADE' })
  environment: Environment;
}
