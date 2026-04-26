import { Injectable, OnApplicationBootstrap, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { UserService } from './user.service';
import { UserRole } from '../entities/user.entity';

@Injectable()
export class SeedService implements OnApplicationBootstrap {
  private readonly logger = new Logger(SeedService.name);

  constructor(
    private readonly userService: UserService,
    private readonly configService: ConfigService,
  ) {}

  async onApplicationBootstrap() {
    await this.seedRootUser();
  }

  private async seedRootUser() {
    const managers = await this.userService.findByRole(UserRole.MANAGER);

    if (managers.length === 0) {
      this.logger.log('No manager user found. Creating root user...');

      const name = this.configService.get<string>('ROOT_USER_NAME');
      const email = this.configService.get<string>('EMAIL');
      const password = this.configService.get<string>('PASSWORD');

      if (!name || !email || !password) {
        this.logger.warn(
          'Root user credentials not fully provided in environment variables (ROOT_USER_NAME, EMAIL, PASSWORD). Skipping root user creation.',
        );
        return;
      }

      const existingUser = await this.userService.findOneByEmail(email);
      if (existingUser) {
        this.logger.warn(`User with email ${email} already exists but is not a manager. Skipping root user creation to avoid conflict.`);
        return;
      }

      await this.userService.create({
        name,
        email,
        password,
        role: UserRole.MANAGER,
      });

      this.logger.log(`Root user created successfully: ${email}`);
    } else {
      this.logger.log('Manager user already exists. Skipping root user creation.');
    }
  }
}
