import {
  Injectable,
  NotFoundException,
  ConflictException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PerfilPlanta } from './entities/perfil-planta.entity';
import { CrearPerfilPlantaDto } from './dto/crear-perfil-planta.dto';
import { ActualizarPerfilPlantaDto } from './dto/actualizar-perfil-planta.dto';

interface MulterFile {
  buffer: Buffer;
  originalname: string;
  mimetype: string;
  size: number;
}

@Injectable()
export class PlantProfilesService {
  constructor(
    @InjectRepository(PerfilPlanta)
    private readonly perfilPlantaRepository: Repository<PerfilPlanta>,
  ) {}

  async crear(
    crearPerfilPlantaDto: CrearPerfilPlantaDto,
  ): Promise<PerfilPlanta> {
    try {
      // Validaciones de negocio
      this.validarRangos(crearPerfilPlantaDto);

      const perfilPlanta =
        this.perfilPlantaRepository.create(crearPerfilPlantaDto);
      return await this.perfilPlantaRepository.save(perfilPlanta);
    } catch (error: any) {
      if (error.code === '23505') {
        // Unique violation
        throw new ConflictException('Ya existe un perfil con este nombre');
      }
      throw error;
    }
  }

  async encontrarTodos(
    incluirInactivos: boolean = false,
  ): Promise<PerfilPlanta[]> {
    const where = incluirInactivos ? {} : { activo: true };
    return await this.perfilPlantaRepository.find({
      where,
      order: { createdAt: 'DESC' },
    });
  }

  async encontrarPorId(id: number): Promise<PerfilPlanta> {
    const perfilPlanta = await this.perfilPlantaRepository.findOne({
      where: { id, activo: true },
    });

    if (!perfilPlanta) {
      throw new NotFoundException(
        `Perfil de planta con ID ${id} no encontrado`,
      );
    }

    return perfilPlanta;
  }

  async encontrarPorNombre(nombre: string): Promise<PerfilPlanta> {
    const perfilPlanta = await this.perfilPlantaRepository.findOne({
      where: { nombre, activo: true },
    });

    if (!perfilPlanta) {
      throw new NotFoundException(`Perfil de planta '${nombre}' no encontrado`);
    }

    return perfilPlanta;
  }

  async encontrarPorTipo(tipoPlanta: string): Promise<PerfilPlanta[]> {
    return await this.perfilPlantaRepository.find({
      where: { tipoPlanta, activo: true },
      order: { nombre: 'ASC' },
    });
  }

  async actualizar(
    id: number,
    actualizarPerfilPlantaDto: ActualizarPerfilPlantaDto,
  ): Promise<PerfilPlanta> {
    const perfilPlanta = await this.encontrarPorId(id);

    try {
      // Validaciones de negocio si se están actualizando rangos
      if (this.tieneRangosParaValidar(actualizarPerfilPlantaDto)) {
        const datosCompletos = {
          ...perfilPlanta,
          ...actualizarPerfilPlantaDto,
        };
        this.validarRangos(datosCompletos);
      }

      Object.assign(perfilPlanta, actualizarPerfilPlantaDto);
      return await this.perfilPlantaRepository.save(perfilPlanta);
    } catch (error) {
      if (error.code === '23505') {
        // Unique violation
        throw new ConflictException('Ya existe un perfil con este nombre');
      }
      throw error;
    }
  }

  async eliminar(id: number): Promise<void> {
    const perfilPlanta = await this.encontrarPorId(id);

    // Soft delete - marcamos como inactivo en lugar de eliminar físicamente
    perfilPlanta.activo = false;
    await this.perfilPlantaRepository.save(perfilPlanta);
  }

  async reactivar(id: number): Promise<PerfilPlanta> {
    // Para reactivar necesitamos buscar también perfiles inactivos
    const perfilPlanta = await this.perfilPlantaRepository.findOne({
      where: { id }, // Sin filtrar por activo
    });

    if (!perfilPlanta) {
      throw new NotFoundException(
        `Perfil de planta con ID ${id} no encontrado`,
      );
    }

    perfilPlanta.activo = true;
    return await this.perfilPlantaRepository.save(perfilPlanta);
  }

  async eliminarFisicamente(id: number): Promise<void> {
    const resultado = await this.perfilPlantaRepository.delete(id);
    if (resultado.affected === 0) {
      throw new NotFoundException(
        `Perfil de planta con ID ${id} no encontrado`,
      );
    }
  }

  async subirImagen(id: number, archivo: MulterFile): Promise<PerfilPlanta> {
    const perfilPlanta = await this.encontrarPorId(id);

    // Validar tipo de archivo
    if (!archivo.mimetype.startsWith('image/')) {
      throw new BadRequestException('El archivo debe ser una imagen');
    }

    // Validar tamaño (máximo 5MB)
    if (archivo.size > 5 * 1024 * 1024) {
      throw new BadRequestException('La imagen no debe superar los 5MB');
    }

    perfilPlanta.imagen = archivo.buffer;
    perfilPlanta.imagenNombre = archivo.originalname;
    perfilPlanta.imagenTipo = archivo.mimetype;
    perfilPlanta.imagenTamaño = archivo.size;

    return await this.perfilPlantaRepository.save(perfilPlanta);
  }

  async obtenerImagen(
    id: number,
  ): Promise<{ buffer: Buffer; mimetype: string; filename: string }> {
    const perfilPlanta = await this.encontrarPorId(id);

    if (!perfilPlanta.imagen) {
      throw new NotFoundException('Este perfil no tiene imagen');
    }

    return {
      buffer: perfilPlanta.imagen,
      mimetype: perfilPlanta.imagenTipo || 'image/jpeg',
      filename: perfilPlanta.imagenNombre || 'imagen.jpg',
    };
  }

  async eliminarImagen(id: number): Promise<PerfilPlanta> {
    const perfilPlanta = await this.encontrarPorId(id);

    perfilPlanta.imagen = undefined;
    perfilPlanta.imagenNombre = undefined;
    perfilPlanta.imagenTipo = undefined;
    perfilPlanta.imagenTamaño = undefined;

    return await this.perfilPlantaRepository.save(perfilPlanta);
  }

  // Métodos de utilidad para estadísticas y reportes
  async obtenerEstadisticas(): Promise<any> {
    const total = await this.perfilPlantaRepository.count({
      where: { activo: true },
    });
    const porTipo = await this.perfilPlantaRepository
      .createQueryBuilder('perfil')
      .select('perfil.tipoPlanta', 'tipo')
      .addSelect('COUNT(*)', 'cantidad')
      .where('perfil.activo = :activo', { activo: true })
      .groupBy('perfil.tipoPlanta')
      .getRawMany();

    return {
      total,
      porTipo,
    };
  }

  // Validaciones privadas
  private validarRangos(
    datos: Partial<CrearPerfilPlantaDto | PerfilPlanta>,
  ): void {
    // Validar rangos de temperatura
    if (
      datos.temperaturaMin &&
      datos.temperaturaMax &&
      datos.temperaturaMin > datos.temperaturaMax
    ) {
      throw new BadRequestException(
        'La temperatura mínima no puede ser mayor que la máxima',
      );
    }

    // Validar rangos de humedad
    if (
      datos.humedadMin &&
      datos.humedadMax &&
      datos.humedadMin > datos.humedadMax
    ) {
      throw new BadRequestException(
        'La humedad mínima no puede ser mayor que la máxima',
      );
    }

    // Validar rangos de pH
    if (datos.phMin && datos.phMax && datos.phMin > datos.phMax) {
      throw new BadRequestException(
        'El pH mínimo no puede ser mayor que el máximo',
      );
    }

    // Validar rangos de nutrientes
    if (
      datos.nitrogenoMin &&
      datos.nitrogenoMax &&
      datos.nitrogenoMin > datos.nitrogenoMax
    ) {
      throw new BadRequestException(
        'El nitrógeno mínimo no puede ser mayor que el máximo',
      );
    }

    if (
      datos.fosforoMin &&
      datos.fosforoMax &&
      datos.fosforoMin > datos.fosforoMax
    ) {
      throw new BadRequestException(
        'El fósforo mínimo no puede ser mayor que el máximo',
      );
    }

    if (
      datos.potasioMin &&
      datos.potasioMax &&
      datos.potasioMin > datos.potasioMax
    ) {
      throw new BadRequestException(
        'El potasio mínimo no puede ser mayor que el máximo',
      );
    }

    // Validar rangos de luz
    if (datos.luzMin && datos.luzMax && datos.luzMin > datos.luzMax) {
      throw new BadRequestException(
        'La luz mínima no puede ser mayor que la máxima',
      );
    }

    // Validar días de crecimiento
    if (
      datos.diasGerminacion &&
      datos.diasCosecha &&
      datos.diasGerminacion > datos.diasCosecha
    ) {
      throw new BadRequestException(
        'Los días de germinación no pueden ser mayores que los días de cosecha',
      );
    }
  }

  private tieneRangosParaValidar(dto: ActualizarPerfilPlantaDto): boolean {
    const camposRango = [
      'temperaturaMin',
      'temperaturaMax',
      'humedadMin',
      'humedadMax',
      'phMin',
      'phMax',
      'nitrogenoMin',
      'nitrogenoMax',
      'fosforoMin',
      'fosforoMax',
      'potasioMin',
      'potasioMax',
      'luzMin',
      'luzMax',
      'diasGerminacion',
      'diasCosecha',
    ];

    return camposRango.some((campo) => dto[campo] !== undefined);
  }
}
