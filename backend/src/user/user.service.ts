import { BadRequestException, ConflictException, Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { User, UserRole } from '../entities/user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { UserRepository } from './user.repository';

@Injectable()
export class UserService {
  constructor(private readonly userRepository: UserRepository) {}

  async findByRole(role: UserRole): Promise<User[]> {
    return this.userRepository.findByRole(role);
  }

  async findOneByEmail(email: string): Promise<User | null> {
    return this.userRepository.findOneByEmail(email);
  }

  async create(userData: CreateUserDto): Promise<User> {

    if (userData.password !== userData.password_confirmation) {
      throw new BadRequestException('Passwords do not match');
    }

    const existingUser = await this.findOneByEmail(userData.email);
    if (existingUser) {
      throw new ConflictException('User already exists');
    }

    const salt = await bcrypt.genSalt();
    const hashedPassword = await bcrypt.hash(userData.password, salt);

    const { password_confirmation, ...userDetails } = userData;

    return this.userRepository.createUser({
      ...userDetails,
      password: hashedPassword,
      is_active: true,
    });
  }
}
