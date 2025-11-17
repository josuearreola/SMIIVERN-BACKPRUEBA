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
      conductivity: dto.data.conductivity,
      ph: dto.data.ph,
      tds: dto.data.tds,
    });
    return this.sensorDataRepository.save(sensorData);
  }

  async getLatest(deviceId?: string): Promise<SensorData | null> {  // Cambia a | null
    const query = this.sensorDataRepository
      .createQueryBuilder('sensor')
      .orderBy('sensor.timestamp', 'DESC')
      .limit(1);
    if (deviceId) {
      query.where('sensor.device_id = :deviceId', { deviceId });
    }
    return query.getOne();
  }

  async getHistory(deviceId: string, limit: number = 50): Promise<SensorData[]> {
    return this.sensorDataRepository.find({
      where: { device_id: deviceId },
      order: { timestamp: 'DESC' },
      take: limit,
    });
  }
}