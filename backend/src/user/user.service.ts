import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import * as bcrypt from 'bcrypt';
import { Repository } from 'typeorm';
import { User, UserRole } from '../entities/user.entity';
import { CreateUserDto } from './dto/create-user.dto';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  async findByRole(role: UserRole): Promise<User[]> {
    return this.userRepository.find({ where: { role } });
  }

  async findOneByEmail(email: string): Promise<User | null> {
    return this.userRepository.findOne({ where: { email } });
  }
  
  async create(userData: CreateUserDto): Promise<User> {  

    if (userData.password !== userData.password_confirmation) {
      throw new Error('Passwords do not match');
    }

    const existingUser = await this.findOneByEmail(userData.email);
    if (existingUser) {
      throw new Error('User already exists');
    }

    const salt = await bcrypt.genSalt();
    const hashedPassword = await bcrypt.hash(userData.password, salt);
    
    const { password_confirmation, ...userDetails } = userData;

    const user = this.userRepository.create({
      ...userDetails,
      password: hashedPassword,
      is_active: true,
    });
    
    return this.userRepository.save(user);
  }
}
