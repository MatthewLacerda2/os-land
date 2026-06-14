import { Injectable, NotFoundException, Logger } from '@nestjs/common';
import { randomUUID } from 'crypto';
import { promises as fs, existsSync } from 'fs';
import * as path from 'path';
import { EnvironmentService } from '../entities/environment-service.entity';
import { CreateMaintenanceDto } from './dto/create-maintenance.dto';
import { MaintenanceRepository, PersistedPhoto } from './maintenance.repository';

@Injectable()
export class MaintenanceService {
  private readonly logger = new Logger(MaintenanceService.name);

  constructor(private readonly maintenanceRepository: MaintenanceRepository) {}

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
      const savedOrder = await this.maintenanceRepository.createOrderWithEnvironments(
        data,
        async (
          _envService: EnvironmentService,
          equipmentIndex: number,
        ): Promise<PersistedPhoto[]> => {
          const eqDto = data.equipments[equipmentIndex];
          const persisted: PersistedPhoto[] = [];

          if (!eqDto || !files['equipment-photos']) {
            return persisted;
          }

          for (const photoDto of eqDto.environmentPhotos) {
            // The frontend sends fileKey which matches the originalname we gave in the FormData append
            const file = files['equipment-photos'].find((f) => f.originalname === photoDto.fileKey);
            if (file) {
              const fileName = `${randomUUID()}${path.extname(file.originalname)}`;
              const filePath = path.join(uploadDir, fileName);

              // Asynchronous, non-blocking file write
              await fs.writeFile(filePath, file.buffer);
              writtenFiles.push(filePath);

              persisted.push({ path: fileName, label: photoDto.label });
            }
          }

          return persisted;
        },
      );

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
    const [items, total] = await this.maintenanceRepository.findAndCount(
      role,
      userId,
      offset,
      limit,
    );

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
    const order = await this.maintenanceRepository.findOneWithRelations(id);

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
