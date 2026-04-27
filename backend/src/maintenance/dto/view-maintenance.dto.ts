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
  name: string;

  @ApiProperty()
  designatedSystem: string;

  @ApiProperty()
  protocolType: string;

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

  @ApiProperty()
  state: string;

  @ApiProperty()
  company: string;

  @ApiProperty()
  description: string;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  initialPhotos: string[];

  @ApiProperty({ required: false })
  technicianName?: string;

  @ApiProperty({ type: [MaintenanceEnvironmentDto] })
  environments: MaintenanceEnvironmentDto[];
}
