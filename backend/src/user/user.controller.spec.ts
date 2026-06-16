import {
  BadRequestException,
  ConflictException,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { Test, TestingModule } from '@nestjs/testing';
import { TypeOrmModule, getRepositoryToken } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { makeCreateUserDto } from '../../test/fixtures';
import { testTypeOrmRoot } from '../../test/setup/test-db';
import {
  RollbackContext,
  useTransactionalRollback,
} from '../../test/setup/transactional';
import { AuthService } from '../auth/auth.service';
import { User } from '../entities/user.entity';
import { UserController } from './user.controller';
import { UserRepository } from './user.repository';
import { UserService } from './user.service';

// Exercises POST /user/create and POST /user/login through the controller down
// to a real Postgres. The global JwtAuthGuard / RolesGuard live in the HTTP
// pipeline, not in the handler, so role gating is an e2e concern and is not
// asserted here.
describe('UserController (Postgres-backed)', () => {
  let moduleRef: TestingModule;
  let controller: UserController;
  let userService: UserService;
  let users: Repository<User>;
  let dataSource: DataSource;
  let tx: RollbackContext;

  beforeAll(async () => {
    moduleRef = await Test.createTestingModule({
      imports: [
        ConfigModule.forRoot({ isGlobal: true }),
        testTypeOrmRoot(),
        TypeOrmModule.forFeature([User]),
        JwtModule.register({
          secret: process.env.JWT_SECRET,
          signOptions: { expiresIn: '1y' },
        }),
      ],
      controllers: [UserController],
      providers: [UserService, UserRepository, AuthService],
    }).compile();
    await moduleRef.init();

    controller = moduleRef.get(UserController);
    userService = moduleRef.get(UserService);
    users = moduleRef.get<Repository<User>>(getRepositoryToken(User));
    dataSource = moduleRef.get(DataSource);
    tx = useTransactionalRollback(dataSource);
  });

  afterAll(async () => {
    await moduleRef.close();
  });

  beforeEach(() => tx.begin());
  afterEach(() => tx.rollback());

  describe('POST /user/create', () => {
    it('persists a user and returns the safe projection', async () => {
      const dto = makeCreateUserDto({ email: 'novo@osland.com' });

      const result = await controller.createUser(dto);

      expect(result).toMatchObject({
        name: dto.name,
        email: dto.email,
        role: dto.role,
      });
      expect(result.id).toEqual(expect.any(String));

      const stored = await users.findOneBy({ email: dto.email });
      expect(stored).not.toBeNull();
      expect(stored?.is_active).toBe(true);
      // Password is hashed, never stored in the clear.
      expect(stored?.password).not.toBe(dto.password);
    });

    it('rejects a mismatched password confirmation', async () => {
      const dto = makeCreateUserDto({ password_confirmation: 'outrasenha' });

      await expect(controller.createUser(dto)).rejects.toBeInstanceOf(
        BadRequestException,
      );
    });

    it('rejects a duplicate email', async () => {
      const dto = makeCreateUserDto({ email: 'dup@osland.com' });
      await controller.createUser(dto);

      await expect(controller.createUser(dto)).rejects.toBeInstanceOf(
        ConflictException,
      );
    });
  });

  describe('POST /user/login', () => {
    it('returns a signed JWT for valid credentials', async () => {
      await userService.create(
        makeCreateUserDto({ email: 'login@osland.com' }),
      );

      const result = await controller.login({
        email: 'login@osland.com',
        password: 'senha123',
      });

      expect(result.email).toBe('login@osland.com');
      expect(typeof result.jwt).toBe('string');
      expect(result.jwt.length).toBeGreaterThan(0);
      expect(typeof result.login_at).toBe('string');
    });

    it('rejects invalid credentials', async () => {
      await userService.create(
        makeCreateUserDto({ email: 'login2@osland.com' }),
      );

      await expect(
        controller.login({ email: 'login2@osland.com', password: 'errada' }),
      ).rejects.toBeInstanceOf(UnauthorizedException);
    });
  });
});
