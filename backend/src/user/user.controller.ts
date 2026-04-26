import { Controller, Post, Body } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { CreateTechnicianDto, TechnicianResponseDto } from './dto/create-technician.dto';
import { LoginDto, LoginResponseDto } from './dto/login.dto';

@ApiTags('User & Auth')
@Controller('user')
export class UserController {
  @Post('create/technician')
  @ApiOperation({ summary: 'Create a new technician user' })
  @ApiResponse({ status: 201, type: TechnicianResponseDto })
  createTechnician(@Body() data: CreateTechnicianDto): TechnicianResponseDto {
    return {
      id: 'uuid-stub',
      name: data.name,
      email: data.email,
    };
  }

  @Post('login')
  @ApiOperation({ summary: 'User login' })
  @ApiResponse({ status: 200, type: LoginResponseDto })
  login(@Body() data: LoginDto): LoginResponseDto {
    return {
      name: 'João Silva',
      email: data.email,
      login_at: new Date().toISOString(),
      jwt: 'jwt-token-stub',
    };
  }
}
