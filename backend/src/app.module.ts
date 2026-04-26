import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { EnvironmentService } from './entities/environment-service.entity';
import { Environment } from './entities/environment.entity';
import { MaintenanceOrder } from './entities/maintenance-order.entity';
import { User } from './entities/user.entity';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DB_HOST,
      port: parseInt(process.env.DB_PORT || '5432', 10),
      username: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      entities: [User, MaintenanceOrder, Environment, EnvironmentService],
      synchronize: true, // Only for development/POC - auto-creates tables
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
