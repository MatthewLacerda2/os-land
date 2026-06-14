import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, EntityManager, Repository } from 'typeorm';
import { EnvironmentService } from '../entities/environment-service.entity';
import { Environment } from '../entities/environment.entity';
import { MaintenanceOrder } from '../entities/maintenance-order.entity';
import { MaintenancePhoto } from '../entities/maintenance-photo.entity';
import { User } from '../entities/user.entity';
import { CreateMaintenanceDto } from './dto/create-maintenance.dto';

export interface PersistedPhoto {
  path: string;
  label: string;
}

@Injectable()
export class MaintenanceRepository {
  constructor(
    @InjectRepository(MaintenanceOrder)
    private readonly orderRepo: Repository<MaintenanceOrder>,
    private readonly dataSource: DataSource,
  ) {}

  /**
   * Persists a maintenance order with its environments, services and photos in a
   * single transaction. The actual photo files are produced by `persistPhotos`,
   * which the caller uses to write the files to disk (I/O orchestration is kept
   * outside the repository); this method only persists the resulting records.
   */
  async createOrderWithEnvironments(
    data: CreateMaintenanceDto,
    technicianId: string,
    persistPhotos: (
      envService: EnvironmentService,
      equipmentIndex: number,
    ) => Promise<PersistedPhoto[]>,
  ): Promise<MaintenanceOrder> {
    return this.dataSource.transaction(async (tem: EntityManager) => {
      const creator = await tem.findOneBy(User, { id: technicianId });
      if (!creator) {
        throw new NotFoundException('User not found');
      }

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

      for (let i = 0; i < data.equipments.length; i++) {
        await this.persistEquipment(tem, savedOrder, data.equipments[i], i, persistPhotos);
      }

      return savedOrder;
    });
  }

  /**
   * Persists a single equipment as an environment + environment service, then
   * writes its photos using the caller-provided `persistPhotos` orchestrator.
   */
  private async persistEquipment(
    tem: EntityManager,
    savedOrder: MaintenanceOrder,
    eqDto: CreateMaintenanceDto['equipments'][number],
    equipmentIndex: number,
    persistPhotos: (
      envService: EnvironmentService,
      equipmentIndex: number,
    ) => Promise<PersistedPhoto[]>,
  ): Promise<void> {
    const environment = await tem.save(
      tem.create(Environment, {
        designatedSystem: eqDto.designatedSystem,
        description: eqDto.description,
        setPoint: eqDto.setPoint,
      }),
    );

    const envService = await tem.save(
      tem.create(EnvironmentService, {
        order: savedOrder,
        environment,
      }),
    );

    const photos = await persistPhotos(envService, equipmentIndex);
    for (const photo of photos) {
      await tem.save(
        tem.create(MaintenancePhoto, {
          path: photo.path,
          label: photo.label,
          environmentService: envService,
        }),
      );
    }
  }

  async findAndCount(
    role: string,
    userId: string,
    offset: number,
    limit: number,
  ): Promise<[MaintenanceOrder[], number]> {
    const query = this.orderRepo
      .createQueryBuilder('order')
      .leftJoinAndSelect('order.creator', 'creator')
      .orderBy('order.createdAt', 'DESC')
      .skip(offset)
      .take(limit);

    if (role === 'technician') {
      query.where('creator.id = :userId', { userId });
    }

    return query.getManyAndCount();
  }

  async findOneWithRelations(id: string): Promise<MaintenanceOrder | null> {
    return this.orderRepo.findOne({
      where: { id },
      relations: [
        'creator',
        'environmentServices',
        'environmentServices.environment',
        'environmentServices.photos',
      ],
    });
  }
}
