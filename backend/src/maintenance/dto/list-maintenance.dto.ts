import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsInt, Min } from 'class-validator';
import { Type } from 'class-transformer';

export class PaginationQueryDto {
  @ApiProperty({ required: false, default: 0 })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(0)
  offset?: number = 0;

  @ApiProperty({ required: false, default: 10 })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  limit?: number = 10;
}

export class MaintenanceItemDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  osNumber: string;

  @ApiProperty()
  location: string;

  @ApiProperty()
  company: string;

  @ApiProperty()
  createdAt: Date;
}

export class MaintenanceListResponseDto {
  @ApiProperty({ type: [MaintenanceItemDto] })
  items: MaintenanceItemDto[];

  @ApiProperty()
  total: number;

  @ApiProperty()
  offset: number;

  @ApiProperty()
  limit: number;
}
