import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { EnvironmentPhoto } from './entities/environment-photo.entity';
import { EnvironmentService } from './entities/environment-service.entity';
import { Environment } from './entities/environment.entity';
import { MaintenanceOrder } from './entities/maintenance-order.entity';
import { MaintenancePhoto } from './entities/maintenance-photo.entity';
import { User } from './entities/user.entity';
import { MaintenanceModule } from './maintenance/maintenance.module';
import { UserModule } from './user/user.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DB_HOST || 'localhost',
      port: parseInt(process.env.DB_PORT || '5432', 10),
      username: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      entities: [
        User, 
        MaintenanceOrder, 
        Environment, 
        EnvironmentService, 
        MaintenancePhoto, 
        EnvironmentPhoto
      ],
      synchronize: true,
    }),
    UserModule,
    MaintenanceModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
