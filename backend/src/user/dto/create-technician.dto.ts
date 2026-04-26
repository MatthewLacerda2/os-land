import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString, Matches, MinLength } from 'class-validator';

export class CreateTechnicianDto {
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
  password_confirmation: string
}

export class TechnicianResponseDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  name: string;

  @ApiProperty()
  email: string;
}
