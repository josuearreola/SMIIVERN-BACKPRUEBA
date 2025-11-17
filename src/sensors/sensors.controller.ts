import { Controller, Post, Get, Body, Query, UseGuards, ValidationPipe } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { SensorsService } from './sensors.service';
import { SensorDataDto } from './dto/sensor-data.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@ApiTags('sensors')
@Controller('sensors')
@UseGuards(JwtAuthGuard) // Protege todos los endpoints con JWT
@ApiBearerAuth() // Para Swagger
export class SensorsController {
  constructor(private readonly sensorsService: SensorsService) {}

  @Post('data')
  @ApiOperation({ summary: 'Recibir datos de sensores desde ESP32' })
  @ApiResponse({ status: 201, description: 'Datos almacenados exitosamente' })
  @ApiResponse({ status: 400, description: 'Datos inválidos' })
  async createData(@Body(ValidationPipe) dto: SensorDataDto) {
    const record = await this.sensorsService.saveSensorData(dto);
    return {
      status: 'success',
      message: 'Data stored successfully',
      record_id: record.id,
    };
  }

  @Get('latest')
  @ApiOperation({ summary: 'Obtener la última lectura de sensores' })
  @ApiResponse({ status: 200, description: 'Última lectura obtenida' })
  async getLatest(@Query('device_id') deviceId?: string) {
    const data = await this.sensorsService.getLatest(deviceId);
    return data;
  }

  @Get('history')
  @ApiOperation({ summary: 'Obtener histórico de lecturas de sensores' })
  @ApiResponse({ status: 200, description: 'Histórico obtenido' })
  async getHistory(
    @Query('device_id') deviceId: string,
    @Query('limit') limit?: number,
  ) {
    const data = await this.sensorsService.getHistory(deviceId, limit);
    return data;
  }
}