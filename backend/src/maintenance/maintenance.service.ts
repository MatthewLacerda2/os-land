import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { randomUUID } from 'crypto';
import * as fs from 'fs';
import * as path from 'path';
import { Repository } from 'typeorm';
import { EnvironmentService } from '../entities/environment-service.entity';
import { Environment } from '../entities/environment.entity';
import { MaintenanceOrder } from '../entities/maintenance-order.entity';
import { MaintenancePhoto } from '../entities/maintenance-photo.entity';
import { User } from '../entities/user.entity';
import { CreateMaintenanceDto } from './dto/create-maintenance.dto';

@Injectable()
export class MaintenanceService {
  constructor(
    @InjectRepository(MaintenanceOrder)
    private orderRepo: Repository<MaintenanceOrder>,
    @InjectRepository(Environment)
    private envRepo: Repository<Environment>,
    @InjectRepository(EnvironmentService)
    private envServiceRepo: Repository<EnvironmentService>,
    @InjectRepository(MaintenancePhoto)
    private photoRepo: Repository<MaintenancePhoto>,
    @InjectRepository(User)
    private userRepo: Repository<User>,
  ) {}

  async create(
    data: CreateMaintenanceDto,
    files: {
      'frontal-picture'?: Express.Multer.File[];
      'ticket-picture'?: Express.Multer.File[];
      'condenser-picture'?: Express.Multer.File[];
      'fault-picture'?: Express.Multer.File[];
      'equipment-photos'?: Express.Multer.File[];
    },
  ) {
    console.log("Creator id: " + data.technicianId)
    const creator = await this.userRepo.findOneBy({ id: data.technicianId });
    if (!creator) {
      throw new NotFoundException('User not found');
    }

    const uploadDir = path.join(process.cwd(), 'uploads');
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }

    // Save initial photos (Mandatory 4 photos)
    const initialPhotos: string[] = [];
    const mainPhotoKeys = ['frontal-picture', 'ticket-picture', 'condenser-picture', 'fault-picture'];
    
    for (const key of mainPhotoKeys) {
      const fileArr = files[key];
      if (!fileArr || fileArr.length === 0) {
        throw new BadRequestException(`A foto obrigatória '${key}' está faltando.`);
      }
      
      const file = fileArr[0];
      const fileName = `${randomUUID()}${path.extname(file.originalname)}`;
      const filePath = path.join(uploadDir, fileName);
      fs.writeFileSync(filePath, file.buffer);
      initialPhotos.push(fileName);
    }

    // Create Order
    const order = this.orderRepo.create({
      osNumber: data.osNumber,
      agency: data.agency,
      state: data.state,
      company: data.company,
      latitude: data.latitude,
      longitude: data.longitude,
      description: data.description,
      technician: creator,
      initialPhotos,
    });

    const savedOrder = await this.orderRepo.save(order);

    // Process Equipments
    for (const eqDto of data.equipments) {
      // 1. Create Environment
      const environment = await this.envRepo.save(
        this.envRepo.create({
          name: eqDto.name,
          designatedSystem: eqDto.designatedSystem,
          protocolType: eqDto.protocolType,
        }),
      );

      // 2. Create EnvironmentService
      const envService = await this.envServiceRepo.save(
        this.envServiceRepo.create({
          order: savedOrder,
          environment,
        }),
      );

      // 3. Save Equipment Photos
      if (files['equipment-photos']) {
        for (const photoDto of eqDto.environmentPhotos) {
          // The frontend sends fileKey which matches the originalname we gave in the FormData append
          const file = files['equipment-photos'].find((f) => f.originalname === photoDto.fileKey);
          if (file) {
            const fileName = `${randomUUID()}${path.extname(file.originalname)}`;
            const filePath = path.join(uploadDir, fileName);
            fs.writeFileSync(filePath, file.buffer);

            await this.photoRepo.save(
              this.photoRepo.create({
                path: fileName,
                label: photoDto.label,
                environmentService: envService,
              }),
            );
          }
        }
      }
    }

    return savedOrder;
  }
}
