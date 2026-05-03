import { Body, Controller, Get, Param, Post, Query, UploadedFiles, UseInterceptors, UseGuards, Req } from '@nestjs/common';
import { FileFieldsInterceptor } from '@nestjs/platform-express';
import { ApiConsumes, ApiOperation, ApiResponse, ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { CreateMaintenanceDto, MaintenanceCreateResponseDto } from './dto/create-maintenance.dto';
import { MaintenanceListResponseDto, PaginationQueryDto } from './dto/list-maintenance.dto';
import { MaintenanceReportResponseDto } from './dto/report-maintenance.dto';
import { MaintenanceViewResponseDto } from './dto/view-maintenance.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import type { Request } from 'express';

import { MaintenanceService } from './maintenance.service';

@ApiTags('Maintenance')
@Controller('maintenance')
export class MaintenanceController {
  constructor(private readonly maintenanceService: MaintenanceService) {}

  @Get('list')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'List all maintenance orders' })
  @ApiResponse({ status: 200, type: MaintenanceListResponseDto })
  async listOrders(
    @Query() query: PaginationQueryDto,
    @Req() req: Request
  ): Promise<MaintenanceListResponseDto> {
    const user = req.user as any;
    return this.maintenanceService.list(
      user.userId,
      user.role,
      query.offset || 0,
      query.limit || 10
    );
  }

  @Post('create')
  @ApiOperation({ summary: 'Create a new maintenance order with multiple images' })
  @ApiConsumes('multipart/form-data')
  @ApiResponse({ status: 201, type: MaintenanceCreateResponseDto })
  @UseInterceptors(FileFieldsInterceptor([
    { name: 'equipment-photos', maxCount: 20 },
  ]))
  async createOrder(
    @Body() data: CreateMaintenanceDto,
    @UploadedFiles() files: {
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

  @Get('view/:id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'View a single maintenance order' })
  @ApiResponse({ status: 200, type: MaintenanceViewResponseDto })
  async viewOrder(
    @Param('id') id: string
  ): Promise<MaintenanceViewResponseDto> {
    return this.maintenanceService.findById(id);
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
