import { Injectable, NotFoundException, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { randomUUID } from 'crypto';
import { promises as fs, existsSync } from 'fs';
import * as path from 'path';
import { Repository, DataSource } from 'typeorm';
import { EnvironmentService } from '../entities/environment-service.entity';
import { Environment } from '../entities/environment.entity';
import { MaintenanceOrder } from '../entities/maintenance-order.entity';
import { MaintenancePhoto } from '../entities/maintenance-photo.entity';
import { User } from '../entities/user.entity';
import { CreateMaintenanceDto } from './dto/create-maintenance.dto';

@Injectable()
export class MaintenanceService {
  private readonly logger = new Logger(MaintenanceService.name);

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
    private dataSource: DataSource,
  ) {}

  async create(
    data: CreateMaintenanceDto,
    files: {
      'equipment-photos'?: Express.Multer.File[];
    },
  ) {
    const uploadDir = path.join(process.cwd(), 'uploads');
    if (!existsSync(uploadDir)) {
      await fs.mkdir(uploadDir, { recursive: true });
    }

    const writtenFiles: string[] = [];

    try {
      const savedOrder = await this.dataSource.transaction(async (tem) => {
        const creator = await tem.findOneBy(User, { id: data.technicianId });
        if (!creator) {
          throw new NotFoundException('User not found');
        }

        // Create Order
        const order = tem.create(MaintenanceOrder, {
          osNumber: data.osNumber,
          agency: data.agency,
          agencyName: data.agencyName,
          state: data.state,
          company: data.company,
          assetNumber: data.assetNumber,
          latitude: data.latitude,
          longitude: data.longitude,
          description: data.description,
          protocolType: data.protocolType,
          environmentName: data.environmentName,
          creator,
        });

        const savedOrder = await tem.save(order);

        // Process Equipments
        for (const eqDto of data.equipments) {
          // 1. Create Environment
          const environment = await tem.save(
            tem.create(Environment, {
              designatedSystem: eqDto.designatedSystem,
              description: eqDto.description,
              setPoint: eqDto.setPoint,
            }),
          );

          // 2. Create EnvironmentService
          const envService = await tem.save(
            tem.create(EnvironmentService, {
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
                
                // Asynchronous, non-blocking file write
                await fs.writeFile(filePath, file.buffer);
                writtenFiles.push(filePath);

                await tem.save(
                  tem.create(MaintenancePhoto, {
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
      });

      return savedOrder;
    } catch (error) {
      // Roll back the written files on database transaction failure
      this.logger.warn('Maintenance order transaction failed. Initiating disk cleanup...');
      for (const filePath of writtenFiles) {
        try {
          if (existsSync(filePath)) {
            await fs.unlink(filePath);
            this.logger.log(`Deleted orphaned file: ${filePath}`);
          }
        } catch (unlinkError) {
          this.logger.error(`Failed to delete orphaned file ${filePath}:`, unlinkError);
        }
      }
      throw error;
    }
  }
  async list(userId: string, role: string, offset: number, limit: number) {
    const query = this.orderRepo.createQueryBuilder('order')
      .leftJoinAndSelect('order.creator', 'creator')
      .orderBy('order.createdAt', 'DESC')
      .skip(offset)
      .take(limit);

    if (role === 'technician') {
      query.where('creator.id = :userId', { userId });
    }

    const [items, total] = await query.getManyAndCount();

    return {
      items: items.map(item => ({
        id: item.id,
        osNumber: item.osNumber,
        location: item.state, // Map as needed
        company: item.company || 'N/A',
        createdAt: item.createdAt,
      })),
      total,
      offset,
      limit,
    };
  }

  async findById(id: string) {
    const order = await this.orderRepo.findOne({
      where: { id },
      relations: [
        'creator',
        'environmentServices',
        'environmentServices.environment',
        'environmentServices.photos',
      ],
    });

    if (!order) {
      throw new NotFoundException('Maintenance order not found');
    }

    return {
      id: order.id,
      osNumber: order.osNumber,
      latitude: order.latitude,
      longitude: order.longitude,
      agency: order.agency,
      agencyName: order.agencyName,
      state: order.state,
      company: order.company,
      assetNumber: order.assetNumber,
      description: order.description,
      protocolType: order.protocolType,
      environmentName: order.environmentName,
      createdAt: order.createdAt,
      technicianName: order.creator?.name,
      environments: order.environmentServices.map((es) => ({
        id: es.environment.id,
        designatedSystem: es.environment.designatedSystem,
        description: es.environment.description,
        setPoint: es.environment.setPoint ?? undefined,
        photos: es.photos.map((p) => ({
          id: p.id,
          path: p.path,
          label: p.label,
        })),
      })),
    };
  }
}
