import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsEnum, IsString, Matches, MinLength } from 'class-validator';
import { UserRole } from '../../entities/user.entity';

export class CreateUserDto {
  @ApiProperty({ example: 'João Silva', description: 'At least 3 characters, no numbers/special chars' })
  @IsString()
  @MinLength(3)
  @Matches(/^[a-zA-ZÀ-ÿ\s]+$/, {
    message: 'Name must not contain numbers or special characters',
  })
  name: string;

  @ApiProperty({ example: 'joao@osland.com' })
  @IsEmail()
  email: string;

  @ApiProperty({ example: 'senha123' })
  @IsString()
  @MinLength(6)
  password: string;

  @ApiProperty({ example: 'Must be identical to password' })
  @IsString()
  @MinLength(6)
  password_confirmation: string;

  @ApiProperty({ enum: UserRole, example: UserRole.TECHNICIAN })
  @IsEnum(UserRole)
  role: UserRole;
}

export class UserResponseDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  name: string;

  @ApiProperty()
  email: string;

  @ApiProperty({ enum: UserRole })
  role: UserRole;
}
