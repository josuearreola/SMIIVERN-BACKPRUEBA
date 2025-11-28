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
      device_id: dto.device_id,
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
    // Cambia a | null
    const query = this.sensorDataRepository
      .createQueryBuilder('sensor')
      .orderBy('sensor.timestamp', 'DESC')
      .limit(1);
    if (deviceId) {
      query.where('sensor.device_id = :deviceId', { deviceId });
    }
    return query.getOne();
  }

  async getHistory(
    deviceId?: string,
    limit: number = 30,
  ): Promise<SensorData[]> {
    const queryBuilder = this.sensorDataRepository
      .createQueryBuilder('sensor')
      .orderBy('sensor.timestamp', 'DESC')
      .limit(limit);

    if (deviceId) {
      queryBuilder.where('sensor.device_id = :deviceId', { deviceId });
    }

    return queryBuilder.getMany();
  }
}
