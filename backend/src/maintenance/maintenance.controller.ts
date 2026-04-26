import { Body, Controller, Get, Param, Post, Query, UploadedFiles, UseInterceptors } from '@nestjs/common';
import { FileFieldsInterceptor } from '@nestjs/platform-express';
import { ApiConsumes, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { CreateMaintenanceDto, MaintenanceCreateResponseDto } from './dto/create-maintenance.dto';
import { MaintenanceListResponseDto, PaginationQueryDto } from './dto/list-maintenance.dto';
import { MaintenanceReportResponseDto } from './dto/report-maintenance.dto';

import { MaintenanceService } from './maintenance.service';

@ApiTags('Maintenance')
@Controller('maintenance')
export class MaintenanceController {
  constructor(private readonly maintenanceService: MaintenanceService) {}

  @Get('list')
  @ApiOperation({ summary: 'List all maintenance orders' })
  @ApiResponse({ status: 200, type: MaintenanceListResponseDto })
  listOrders(@Query() query: PaginationQueryDto): MaintenanceListResponseDto {
    return {
      items: [],
      total: 0,
      offset: query.offset || 0,
      limit: query.limit || 10,
    };
  }

  @Post('create')
  @ApiOperation({ summary: 'Create a new maintenance order with multiple images' })
  @ApiConsumes('multipart/form-data')
  @ApiResponse({ status: 201, type: MaintenanceCreateResponseDto })
  @UseInterceptors(FileFieldsInterceptor([
    { name: 'frontal-picture', maxCount: 1 },
    { name: 'ticket-picture', maxCount: 1 },
    { name: 'condenser-picture', maxCount: 1 },
    { name: 'fault-picture', maxCount: 1 },
    { name: 'equipment-photos', maxCount: 20 },
  ]))
  async createOrder(
    @Body() data: CreateMaintenanceDto,
    @UploadedFiles() files: {
      'frontal-picture'?: Express.Multer.File[],
      'ticket-picture'?: Express.Multer.File[],
      'condenser-picture'?: Express.Multer.File[],
      'fault-picture'?: Express.Multer.File[],
      'equipment-photos'?: Express.Multer.File[],
    }
  ): Promise<MaintenanceCreateResponseDto> {
    // If the data comes from a Multipart form, 'equipments' will be a string
    if (typeof data.equipments === 'string') {
      data.equipments = JSON.parse(data.equipments);
    }

    const savedOrder = await this.maintenanceService.create(data, files);
    return {
      id: savedOrder.id,
      agency: savedOrder.agency,
    };
  }

  @Get('report/:id')
  @ApiOperation({ summary: 'Generate maintenance report PDF' })
  @ApiResponse({ status: 200, type: MaintenanceReportResponseDto })
  generateReport(@Param('id') id: string): MaintenanceReportResponseDto {
    return { 
      url: `http://localhost:3000/reports/stub-${id}.pdf`,
      filename: `Report-${id}.pdf`
    };
  }
}
