import { 
  Controller, 
  Get, 
  Post, 
  Body, 
  Patch, 
  Param, 
  Delete, 
  Query, 
  UseInterceptors, 
  UploadedFile,
  Res,
  ParseIntPipe,
  UseGuards
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import type { Response } from 'express';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { PlantProfilesService } from './plant-profiles.service';
import { CrearPerfilPlantaDto } from './dto/crear-perfil-planta.dto';
import { ActualizarPerfilPlantaDto } from './dto/actualizar-perfil-planta.dto';

@Controller('plant-profiles')
@UseGuards(JwtAuthGuard)
export class PlantProfilesController {
  constructor(private readonly plantProfilesService: PlantProfilesService) {}

  @Post()
  crear(@Body() crearPerfilPlantaDto: CrearPerfilPlantaDto) {
    return this.plantProfilesService.crear(crearPerfilPlantaDto);
  }

  @Get()
  encontrarTodos(@Query('incluirInactivos') incluirInactivos?: string) {
    const incluir = incluirInactivos === 'true';
    return this.plantProfilesService.encontrarTodos(incluir);
  }

  @Get('estadisticas')
  obtenerEstadisticas() {
    return this.plantProfilesService.obtenerEstadisticas();
  }

  @Get('tipo/:tipo')
  encontrarPorTipo(@Param('tipo') tipo: string) {
    return this.plantProfilesService.encontrarPorTipo(tipo);
  }

  @Get(':id')
  encontrarPorId(@Param('id', ParseIntPipe) id: number) {
    return this.plantProfilesService.encontrarPorId(id);
  }

  @Get('nombre/:nombre')
  encontrarPorNombre(@Param('nombre') nombre: string) {
    return this.plantProfilesService.encontrarPorNombre(nombre);
  }

  @Patch(':id')
  actualizar(
    @Param('id', ParseIntPipe) id: number, 
    @Body() actualizarPerfilPlantaDto: ActualizarPerfilPlantaDto
  ) {
    return this.plantProfilesService.actualizar(id, actualizarPerfilPlantaDto);
  }

  @Patch(':id/reactivar')
  reactivar(@Param('id', ParseIntPipe) id: number) {
    return this.plantProfilesService.reactivar(id);
  }

  @Delete(':id')
  eliminar(@Param('id', ParseIntPipe) id: number) {
    return this.plantProfilesService.eliminar(id);
  }

  @Delete(':id/fisico')
  eliminarFisicamente(@Param('id', ParseIntPipe) id: number) {
    return this.plantProfilesService.eliminarFisicamente(id);
  }

  // Endpoints para manejo de imágenes
  @Post(':id/imagen')
  @UseInterceptors(FileInterceptor('imagen'))
  subirImagen(
    @Param('id', ParseIntPipe) id: number,
    @UploadedFile() archivo: any,
  ) {
    return this.plantProfilesService.subirImagen(id, archivo);
  }

  @Get(':id/imagen')
  async obtenerImagen(
    @Param('id', ParseIntPipe) id: number,
    @Res() res: Response,
  ) {
    const { buffer, mimetype, filename } = await this.plantProfilesService.obtenerImagen(id);
    
    res.set({
      'Content-Type': mimetype,
      'Content-Disposition': `inline; filename="${filename}"`,
    });
    
    res.send(buffer);
  }

  @Delete(':id/imagen')
  eliminarImagen(@Param('id', ParseIntPipe) id: number) {
    return this.plantProfilesService.eliminarImagen(id);
  }
}