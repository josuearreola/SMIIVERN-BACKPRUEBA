import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SensorsController } from './sensors.controller';
import { SensorsService } from './sensors.service';
import { SensorData } from './sensor-data.entity';

@Module({
  imports: [TypeOrmModule.forFeature([SensorData])], // Registra la entidad para inyección de repository
  controllers: [SensorsController], // Declara el controller
  providers: [SensorsService], // Declara el service
})
export class SensorsModule {}