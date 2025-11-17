import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PlantProfilesService } from './plant-profiles.service';
import { PlantProfilesController } from './plant-profiles.controller';
import { PerfilPlanta } from './entities/perfil-planta.entity';

@Module({
  imports: [TypeOrmModule.forFeature([PerfilPlanta])],
  controllers: [PlantProfilesController],
  providers: [PlantProfilesService],
  exports: [PlantProfilesService],
})
export class PlantProfilesModule {}