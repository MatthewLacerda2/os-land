import { NotFoundException } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { Test, TestingModule } from '@nestjs/testing';
import { TypeOrmModule, getRepositoryToken } from '@nestjs/typeorm';
import { existsSync, promises as fs } from 'fs';
import { join } from 'path';
import { DataSource, Repository } from 'typeorm';
import {
  makeAuthenticatedUser,
  makeCreateMaintenanceDto,
  makeMulterFile,
  makeRequest,
} from '../../test/fixtures';
import { testTypeOrmRoot } from '../../test/setup/test-db';
import {
  RollbackContext,
  useTransactionalRollback,
} from '../../test/setup/transactional';
import { MaintenanceOrder } from '../entities/maintenance-order.entity';
import { MaintenancePhoto } from '../entities/maintenance-photo.entity';
import { User, UserRole } from '../entities/user.entity';
import { MaintenanceController } from './maintenance.controller';
import { MaintenanceRepository } from './maintenance.repository';
import { MaintenanceService } from './maintenance.service';

const UPLOAD_DIR = join(process.cwd(), 'uploads');
const UNKNOWN_ID = '00000000-0000-0000-0000-000000000000';

// Exercises the four /maintenance endpoints through the controller down to a
// real Postgres. Auth/role guards live in the HTTP pipeline and are not
// asserted here; `req.user` is supplied directly as the guard would.
describe('MaintenanceController (Postgres-backed)', () => {
  let moduleRef: TestingModule;
  let controller: MaintenanceController;
  let orders: Repository<MaintenanceOrder>;
  let photos: Repository<MaintenancePhoto>;
  let users: Repository<User>;
  let dataSource: DataSource;
  let tx: RollbackContext;
  // Files the upload flow wrote to disk, cleaned up after each test.
  const writtenPhotoPaths: string[] = [];

  beforeAll(async () => {
    moduleRef = await Test.createTestingModule({
      imports: [
        ConfigModule.forRoot({ isGlobal: true }),
        testTypeOrmRoot(),
        TypeOrmModule.forFeature([MaintenanceOrder, MaintenancePhoto, User]),
      ],
      controllers: [MaintenanceController],
      providers: [MaintenanceService, MaintenanceRepository],
    }).compile();
    await moduleRef.init();

    controller = moduleRef.get(MaintenanceController);
    orders = moduleRef.get<Repository<MaintenanceOrder>>(
      getRepositoryToken(MaintenanceOrder),
    );
    photos = moduleRef.get<Repository<MaintenancePhoto>>(
      getRepositoryToken(MaintenancePhoto),
    );
    users = moduleRef.get<Repository<User>>(getRepositoryToken(User));
    dataSource = moduleRef.get(DataSource);
    tx = useTransactionalRollback(dataSource);
  });

  afterAll(async () => {
    await moduleRef.close();
  });

  beforeEach(() => tx.begin());

  afterEach(async () => {
    await tx.rollback();
    while (writtenPhotoPaths.length > 0) {
      const name = writtenPhotoPaths.pop();
      if (name) {
        await fs.rm(join(UPLOAD_DIR, name), { force: true });
      }
    }
  });

  function seedUser(role: UserRole, email: string): Promise<User> {
    return users.save(
      users.create({
        name: 'Maria Tecnica',
        email,
        password: 'hashed',
        is_active: true,
        role,
      }),
    );
  }

  function uploadFiles() {
    return {
      'equipment-photos': [
        makeMulterFile('photo-a'),
        makeMulterFile('photo-b'),
      ],
    };
  }

  describe('GET /maintenance/list', () => {
    it('returns only the technician own orders', async () => {
      const tech = await seedUser(UserRole.TECHNICIAN, 'tech@osland.com');
      const other = await seedUser(UserRole.TECHNICIAN, 'other@osland.com');
      await orders.save(
        orders.create({
          osNumber: 'OS-1',
          agency: 'A',
          state: 'SP',
          latitude: '0',
          longitude: '0',
          description: 'd',
          creator: tech,
        }),
      );
      await orders.save(
        orders.create({
          osNumber: 'OS-2',
          agency: 'B',
          state: 'RJ',
          latitude: '0',
          longitude: '0',
          description: 'd',
          creator: other,
        }),
      );

      const result = await controller.listOrders(
        { offset: 0, limit: 10 },
        makeRequest(
          makeAuthenticatedUser({
            userId: tech.id,
            role: UserRole.TECHNICIAN,
          }),
        ),
      );

      expect(result.total).toBe(1);
      expect(result.items).toHaveLength(1);
      expect(result.items[0].osNumber).toBe('OS-1');
    });

    it('returns every order for a manager', async () => {
      const tech = await seedUser(UserRole.TECHNICIAN, 'tech@osland.com');
      await orders.save(
        orders.create({
          osNumber: 'OS-1',
          agency: 'A',
          state: 'SP',
          latitude: '0',
          longitude: '0',
          description: 'd',
          creator: tech,
        }),
      );
      await orders.save(
        orders.create({
          osNumber: 'OS-2',
          agency: 'B',
          state: 'RJ',
          latitude: '0',
          longitude: '0',
          description: 'd',
          creator: tech,
        }),
      );

      const result = await controller.listOrders(
        { offset: 0, limit: 10 },
        makeRequest(
          makeAuthenticatedUser({ userId: tech.id, role: UserRole.MANAGER }),
        ),
      );

      expect(result.total).toBe(2);
      expect(result.items).toHaveLength(2);
    });

    it('honours offset and limit while reporting the full total', async () => {
      const tech = await seedUser(UserRole.TECHNICIAN, 'tech@osland.com');
      for (const osNumber of ['OS-1', 'OS-2', 'OS-3']) {
        await orders.save(
          orders.create({
            osNumber,
            agency: 'A',
            state: 'SP',
            latitude: '0',
            longitude: '0',
            description: 'd',
            creator: tech,
          }),
        );
      }

      const result = await controller.listOrders(
        { offset: 1, limit: 1 },
        makeRequest(
          makeAuthenticatedUser({ userId: tech.id, role: UserRole.MANAGER }),
        ),
      );

      expect(result.total).toBe(3);
      expect(result.items).toHaveLength(1);
      expect(result.offset).toBe(1);
      expect(result.limit).toBe(1);
    });
  });

  describe('POST /maintenance/create', () => {
    it('persists the order graph and writes photo files to disk', async () => {
      const tech = await seedUser(UserRole.TECHNICIAN, 'creator@osland.com');
      const dto = makeCreateMaintenanceDto();

      const result = await controller.createOrder(
        dto,
        uploadFiles(),
        makeRequest(makeAuthenticatedUser({ userId: tech.id })),
      );

      expect(result.agency).toBe(dto.agency);
      expect(result.id).toEqual(expect.any(String));

      const stored = await orders.findOne({
        where: { id: result.id },
        relations: ['environmentServices', 'environmentServices.photos'],
      });
      expect(stored).not.toBeNull();
      expect(stored?.environmentServices).toHaveLength(1);

      const persistedPhotos = await photos.find();
      expect(persistedPhotos).toHaveLength(2);
      for (const photo of persistedPhotos) {
        writtenPhotoPaths.push(photo.path);
        expect(existsSync(join(UPLOAD_DIR, photo.path))).toBe(true);
      }
    });

    it('throws NotFoundException when the technician does not exist', async () => {
      await expect(
        controller.createOrder(
          makeCreateMaintenanceDto(),
          uploadFiles(),
          makeRequest(makeAuthenticatedUser({ userId: UNKNOWN_ID })),
        ),
      ).rejects.toBeInstanceOf(NotFoundException);

      // The creator check runs before any photo is written.
      expect(await photos.count()).toBe(0);
    });
  });

  describe('GET /maintenance/view/:id', () => {
    it('returns the full order projection', async () => {
      const tech = await seedUser(UserRole.TECHNICIAN, 'creator@osland.com');
      const dto = makeCreateMaintenanceDto();
      const created = await controller.createOrder(
        dto,
        uploadFiles(),
        makeRequest(makeAuthenticatedUser({ userId: tech.id })),
      );
      const stored = await photos.find();
      for (const photo of stored) {
        writtenPhotoPaths.push(photo.path);
      }

      const result = await controller.viewOrder(created.id);

      expect(result.id).toBe(created.id);
      expect(result.osNumber).toBe(dto.osNumber);
      expect(result.technicianName).toBe(tech.name);
      expect(result.environments).toHaveLength(1);
      expect(result.environments[0].photos).toHaveLength(2);
    });

    it('throws NotFoundException for an unknown id', async () => {
      await expect(controller.viewOrder(UNKNOWN_ID)).rejects.toBeInstanceOf(
        NotFoundException,
      );
    });
  });

  describe('GET /maintenance/report/:id', () => {
    it('returns a stub report url and filename for the id', () => {
      const result = controller.generateReport('abc-123');

      expect(result.url).toContain('abc-123');
      expect(result.filename).toBe('Report-abc-123.pdf');
    });
  });
});
