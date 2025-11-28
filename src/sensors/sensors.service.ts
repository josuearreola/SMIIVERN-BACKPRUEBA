import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { SensorData } from './sensor-data.entity';
import { SensorDataDto } from './dto/sensor-data.dto';

@Injectable()
export class SensorsService {
  constructor(
    @InjectRepository(SensorData)
    private sensorDataRepository: Repository<SensorData>,
  ) {}

  async saveSensorData(dto: SensorDataDto): Promise<SensorData> {
    const sensorData = this.sensorDataRepository.create({
      device_id: dto.device_id || null, // Permitir null si no se proporciona
      timestamp: new Date(dto.timestamp),
      temperature: dto.data.temperature,
      humidity: dto.data.humidity,
      ph: dto.data.ph,
      conductivity: dto.data.conductivity,
      tds: dto.data.tds,
      n: dto.data.n,
      p: dto.data.p,
      k: dto.data.k,
    });
    return this.sensorDataRepository.save(sensorData);
  }

  async getLatest(deviceId?: string): Promise<SensorData | null> {
    // Definir rango de fechas válidas (último año hasta 1 hora en el futuro)
    const now = new Date();
    const oneYearAgo = new Date(now.getTime() - 365 * 24 * 60 * 60 * 1000);
    const oneHourFuture = new Date(now.getTime() + 60 * 60 * 1000);
    
    const query = this.sensorDataRepository
      .createQueryBuilder('sensor')
      .where('sensor.timestamp >= :oneYearAgo', { oneYearAgo })
      .andWhere('sensor.timestamp <= :oneHourFuture', { oneHourFuture })
      .orderBy('sensor.timestamp', 'DESC')
      .limit(1);
      
    if (deviceId) {
      query.andWhere('sensor.device_id = :deviceId', { deviceId });
    }
    
    const result = await query.getOne();
    
    if (result) {
      console.log(`Último registro válido encontrado: ID ${result.id}, timestamp: ${result.timestamp}`);
    } else {
      console.log('No se encontraron registros válidos');
    }
    
    return result;
  }

  async getHistory(
    deviceId?: string,
    limit: number = 50,
  ): Promise<SensorData[]> {
    // Definir rango de fechas válidas (último año hasta 1 hora en el futuro)
    const now = new Date();
    const oneYearAgo = new Date(now.getTime() - 365 * 24 * 60 * 60 * 1000);
    const oneHourFuture = new Date(now.getTime() + 60 * 60 * 1000);
    
    const query = this.sensorDataRepository
      .createQueryBuilder('sensor')
      .where('sensor.timestamp >= :oneYearAgo', { oneYearAgo })
      .andWhere('sensor.timestamp <= :oneHourFuture', { oneHourFuture })
      .orderBy('sensor.timestamp', 'DESC')
      .limit(limit);
    
    if (deviceId) {
      query.andWhere('sensor.device_id = :deviceId', { deviceId });
    }
    
    const results = await query.getMany();
    console.log(`Histórico: ${results.length} registros válidos encontrados`);
    
    return results;
  }

  /**
   * Obtiene estadísticas de los datos de sensores
   */
  async getDataStats(): Promise<{
    total: number;
    valid: number;
    corrupted: number;
    latest_valid_timestamp: Date | null;
    oldest_timestamp: Date | null;
  }> {
    const now = new Date();
    const oneYearAgo = new Date(now.getTime() - 365 * 24 * 60 * 60 * 1000);
    const oneHourFuture = new Date(now.getTime() + 60 * 60 * 1000);

    // Contar total de registros
    const total = await this.sensorDataRepository.count();

    // Contar registros válidos
    const valid = await this.sensorDataRepository
      .createQueryBuilder('sensor')
      .where('sensor.timestamp >= :oneYearAgo', { oneYearAgo })
      .andWhere('sensor.timestamp <= :oneHourFuture', { oneHourFuture })
      .getCount();

    // Obtener el timestamp más reciente válido
    const latestValid = await this.sensorDataRepository
      .createQueryBuilder('sensor')
      .select('sensor.timestamp')
      .where('sensor.timestamp >= :oneYearAgo', { oneYearAgo })
      .andWhere('sensor.timestamp <= :oneHourFuture', { oneHourFuture })
      .orderBy('sensor.timestamp', 'DESC')
      .limit(1)
      .getOne();

    // Obtener el timestamp más antiguo
    const oldest = await this.sensorDataRepository
      .createQueryBuilder('sensor')
      .select('sensor.timestamp')
      .orderBy('sensor.timestamp', 'ASC')
      .limit(1)
      .getOne();

    return {
      total,
      valid,
      corrupted: total - valid,
      latest_valid_timestamp: latestValid?.timestamp || null,
      oldest_timestamp: oldest?.timestamp || null,
    };
  }
}
