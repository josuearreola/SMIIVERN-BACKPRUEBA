import { PartialType } from '@nestjs/mapped-types';
import { CrearPerfilPlantaDto } from './crear-perfil-planta.dto';

export class ActualizarPerfilPlantaDto extends PartialType(CrearPerfilPlantaDto) {}
