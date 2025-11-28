import {
  Controller,
  Post,
  Get,
  Body,
  Query,
  UseGuards,
  ValidationPipe,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { SensorsService } from './sensors.service';
import { SensorDataDto } from './dto/sensor-data.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@ApiTags('sensors')
@Controller('sensors')
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
  @UseGuards(JwtAuthGuard) // Protege GETs con JWT para PWA
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Obtener la última lectura de sensores' })
  @ApiResponse({ status: 200, description: 'Última lectura obtenida' })
  async getLatest(@Query('device_id') deviceId?: string) {
    const data = await this.sensorsService.getLatest(deviceId);
    return data;
  }

  @Get('history')
  @UseGuards(JwtAuthGuard) // Protege GETs con JWT para PWA
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Obtener histórico de lecturas de sensores' })
  @ApiResponse({ status: 200, description: 'Histórico obtenido' })
  async getHistory(
    @Query('device_id') deviceId?: string,
    @Query('limit') limit?: number,
  ) {
    const data = await this.sensorsService.getHistory(deviceId, limit);
    return data;
  }

  @Get('stats')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Obtener estadísticas de los datos de sensores' })
  @ApiResponse({ status: 200, description: 'Estadísticas obtenidas' })
  async getStats() {
    const stats = await this.sensorsService.getDataStats();
    return stats;
  }
}
