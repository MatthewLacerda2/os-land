import { Body, Controller, Post } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { CreateUserDto, UserResponseDto } from './dto/create-user.dto';
import { LoginDto, LoginResponseDto } from './dto/login.dto';
import { UserService } from './user.service';
import { AuthService } from '../auth/auth.service';
import { Public } from '../auth/decorators/public.decorator';
import { Roles } from '../auth/decorators/roles.decorator';
import { UserRole } from '../entities/user.entity';

@ApiTags('User & Auth')
@Controller('user')
export class UserController {
  constructor(
    private readonly userService: UserService,
    private readonly authService: AuthService,
  ) {}

  @Post('create')
  @Roles(UserRole.MANAGER)
  @ApiOperation({ summary: 'Create a new user (Manager only)' })
  @ApiResponse({ status: 201, type: UserResponseDto })
  async createUser(@Body() data: CreateUserDto): Promise<UserResponseDto> {
    const user = await this.userService.create(data);
    
    return {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
    };
  }

  @Public()
  @Post('login')
  @ApiOperation({ summary: 'User login' })
  @ApiResponse({ status: 200, type: LoginResponseDto })
  async login(@Body() data: LoginDto): Promise<LoginResponseDto> {
    return this.authService.login(data);
  }
}
