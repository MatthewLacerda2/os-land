import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { ArrayMinSize, IsArray, IsNotEmpty, IsOptional, IsString, ValidateNested } from 'class-validator';
import { DesignatedSystem, ProtocolType } from '../../entities/environment.entity';

export class CreateEquipmentPhotoDto {
  @ApiProperty({ example: 'Evaporadora' })
  @IsString()
  @IsNotEmpty()
  label: string;

  @ApiProperty({ description: 'Key matching the file in the multipart request' })
  @IsString()
  @IsNotEmpty()
  fileKey: string;
}

export class CreateEquipmentDto {
  @ApiProperty({ example: 'Sala de Servidores A' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({ enum: ProtocolType })
  @IsNotEmpty()
  protocolType: ProtocolType;

  @ApiProperty({ enum: DesignatedSystem })
  @IsNotEmpty()
  designatedSystem: DesignatedSystem;

  @ApiProperty({ type: [CreateEquipmentPhotoDto] })
  @IsArray()
  @ArrayMinSize(2)
  @ValidateNested({ each: true })
  @Type(() => CreateEquipmentPhotoDto)
  environmentPhotos: CreateEquipmentPhotoDto[];
}

export class CreateMaintenanceDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  technicianId: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  osNumber: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  agency: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  state: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  company?: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  latitude: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  longitude: string;

  @ApiProperty()
  @IsString()
  description: string;

  @ApiProperty({ type: [CreateEquipmentDto] })
  @IsArray()
  @ArrayMinSize(1)
  @ValidateNested({ each: true })
  @Type(() => CreateEquipmentDto)
  equipments: CreateEquipmentDto[];
}

export class MaintenanceCreateResponseDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  agency: string;
}
