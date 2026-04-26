import { Body, Controller, Get, Post, Query } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { MaintenanceListResponseDto, PaginationQueryDto } from './dto/list-maintenance.dto';

@ApiTags('Maintenance')
@Controller('maintenance')
export class MaintenanceController {
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
  @ApiOperation({ summary: 'Create a new maintenance order' })
  createOrder(@Body() data: any) {
    return { id: 'uuid-stub', status: 'created' };
  }

  @Get('report')
  @ApiOperation({ summary: 'Generate maintenance report' })
  generateReport(@Query('id') id: string) {
    return { report_url: 'http://link-to-pdf-stub' };
  }
}
