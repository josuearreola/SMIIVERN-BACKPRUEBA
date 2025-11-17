import { IsString, IsNumber, IsOptional, IsBoolean, Min, Max, IsIn } from 'class-validator';
import { Transform } from 'class-transformer';

export class CrearPerfilPlantaDto {
  @IsString()
  nombre: string;

  @IsString()
  @IsOptional()
  descripcion?: string;

  // Parámetros de temperatura
  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(-50)
  @Max(100)
  @Transform(({ value }) => Number(value))
  temperaturaMin: number;

  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(-50)
  @Max(100)
  @Transform(({ value }) => Number(value))
  temperaturaMax: number;

  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(-50)
  @Max(100)
  @IsOptional()
  @Transform(({ value }) => Number(value))
  temperaturaOptima?: number;

  // Parámetros de humedad
  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(0)
  @Max(100)
  @Transform(({ value }) => Number(value))
  humedadMin: number;

  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(0)
  @Max(100)
  @Transform(({ value }) => Number(value))
  humedadMax: number;

  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(0)
  @Max(100)
  @IsOptional()
  @Transform(({ value }) => Number(value))
  humedadOptima?: number;

  // Parámetros de pH
  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(0)
  @Max(14)
  @Transform(({ value }) => Number(value))
  phMin: number;

  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(0)
  @Max(14)
  @Transform(({ value }) => Number(value))
  phMax: number;

  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(0)
  @Max(14)
  @IsOptional()
  @Transform(({ value }) => Number(value))
  phOptimo?: number;

  // Parámetros de NPK
  @IsNumber({}, { message: 'nitrogenoMin debe ser un número' })
  @Min(0)
  @Transform(({ value }) => Number(value))
  nitrogenoMin: number;

  @IsNumber({}, { message: 'nitrogenoMax debe ser un número' })
  @Min(0)
  @Transform(({ value }) => Number(value))
  nitrogenoMax: number;

  @IsNumber({}, { message: 'nitrogenoOptimo debe ser un número' })
  @Min(0)
  @IsOptional()
  @Transform(({ value }) => Number(value))
  nitrogenoOptimo?: number;

  @IsNumber({}, { message: 'fosforoMin debe ser un número' })
  @Min(0)
  @Transform(({ value }) => Number(value))
  fosforoMin: number;

  @IsNumber({}, { message: 'fosforoMax debe ser un número' })
  @Min(0)
  @Transform(({ value }) => Number(value))
  fosforoMax: number;

  @IsNumber({}, { message: 'fosforoOptimo debe ser un número' })
  @Min(0)
  @IsOptional()
  @Transform(({ value }) => Number(value))
  fosforoOptimo?: number;

  @IsNumber({}, { message: 'potasioMin debe ser un número' })
  @Min(0)
  @Transform(({ value }) => Number(value))
  potasioMin: number;

  @IsNumber({}, { message: 'potasioMax debe ser un número' })
  @Min(0)
  @Transform(({ value }) => Number(value))
  potasioMax: number;

  @IsNumber({}, { message: 'potasioOptimo debe ser un número' })
  @Min(0)
  @IsOptional()
  @Transform(({ value }) => Number(value))
  potasioOptimo?: number;

  // Parámetros de luz
  @IsNumber({}, { message: 'luzMin debe ser un número' })
  @Min(0)
  @IsOptional()
  @Transform(({ value }) => Number(value))
  luzMin?: number;

  @IsNumber({}, { message: 'luzMax debe ser un número' })
  @Min(0)
  @IsOptional()
  @Transform(({ value }) => Number(value))
  luzMax?: number;

  @IsNumber({}, { message: 'horasLuzDiarias debe ser un número' })
  @Min(0)
  @Max(24)
  @IsOptional()
  @Transform(({ value }) => Number(value))
  horasLuzDiarias?: number;

  // Parámetros de crecimiento
  @IsNumber({}, { message: 'diasGerminacion debe ser un número' })
  @Min(1)
  @IsOptional()
  @Transform(({ value }) => Number(value))
  diasGerminacion?: number;

  @IsNumber({}, { message: 'diasCosecha debe ser un número' })
  @Min(1)
  @IsOptional()
  @Transform(({ value }) => Number(value))
  diasCosecha?: number;

  // Información adicional
  @IsString()
  @IsOptional()
  tipoPlanta?: string;

  // Estado
  @IsBoolean()
  @IsOptional()
  activo?: boolean;
}
