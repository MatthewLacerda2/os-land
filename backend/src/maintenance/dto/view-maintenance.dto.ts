import { ApiProperty } from '@nestjs/swagger';

export class MaintenancePhotoDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  path: string;

  @ApiProperty()
  label: string;
}

export class MaintenanceEnvironmentDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  designatedSystem: string;

  @ApiProperty({ required: false })
  description?: string;

  @ApiProperty({ required: false })
  setPoint?: number;

  @ApiProperty({ type: [MaintenancePhotoDto] })
  photos: MaintenancePhotoDto[];
}

export class MaintenanceViewResponseDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  osNumber: string;

  @ApiProperty()
  latitude: string;

  @ApiProperty()
  longitude: string;

  @ApiProperty()
  agency: string;

  @ApiProperty({ required: false })
  agencyName?: string;

  @ApiProperty()
  state: string;

  @ApiProperty()
  company: string;

  @ApiProperty({ required: false })
  assetNumber?: string;

  @ApiProperty()
  description: string;

  @ApiProperty()
  protocolType: string;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty({ required: false })
  environmentName?: string;

  @ApiProperty({ required: false })
  technicianName?: string;

  @ApiProperty({ type: [MaintenanceEnvironmentDto] })
  environments: MaintenanceEnvironmentDto[];
}
