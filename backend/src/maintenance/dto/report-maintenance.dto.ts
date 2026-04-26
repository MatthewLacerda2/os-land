import { ApiProperty } from '@nestjs/swagger';

export class MaintenanceReportResponseDto {
  @ApiProperty({ example: 'http://localhost:3000/uploads/reports/report-123.pdf' })
  url: string;

  @ApiProperty({ example: 'OS-1234_Report.pdf' })
  filename: string;
}
