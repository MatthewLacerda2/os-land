import { ApiProperty } from '@nestjs/swagger';
import { Type, Transform } from 'class-transformer';
import {
  ArrayMinSize,
  IsArray,
  IsNotEmpty,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';
import {
  DesignatedSystem,
  ProtocolType,
} from '../../entities/environment.enums';

export class CreateEquipmentPhotoDto {
  @ApiProperty({ example: 'Evaporadora' })
  @IsString()
  @IsNotEmpty()
  label: string;

  @ApiProperty({
    description: 'Key matching the file in the multipart request',
  })
  @IsString()
  @IsNotEmpty()
  fileKey: string;
}

export class CreateEquipmentDto {
  @ApiProperty({ enum: DesignatedSystem })
  @IsNotEmpty()
  designatedSystem: DesignatedSystem;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  setPoint?: number;

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
  osNumber: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  agency: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  agencyName?: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  state: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  company?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  assetNumber?: string;

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

  @ApiProperty({ enum: ProtocolType })
  @IsNotEmpty()
  protocolType: ProtocolType;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  environmentName?: string;

  @ApiProperty({ type: [CreateEquipmentDto] })
  @Transform(({ value }: { value: unknown }) => {
    if (typeof value === 'string') {
      try {
        return JSON.parse(value) as CreateEquipmentDto[];
      } catch {
        return value;
      }
    }
    return value;
  })
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
