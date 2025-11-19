import {
  IsString,
  IsDateString,
  ValidateNested,
  IsOptional,
  IsNumber,
} from 'class-validator';
import { Type } from 'class-transformer';

class SensorDataValuesDto {
  @IsOptional()
  @IsNumber()
  temperature?: number;

  @IsOptional()
  @IsNumber()
  humidity?: number;

  @IsOptional()
  @IsOptional()
  @IsNumber()
  ph?: number;

  @IsOptional()
  @IsNumber()
  conductivity?: number;

  @IsOptional()
  @IsNumber()
  tds?: number;

  @IsOptional()
  @IsNumber()
  n?: number; // Nitrógeno

  @IsOptional()
  @IsNumber()
  p?: number; // Fósforo

  @IsOptional()
  @IsNumber()
  k?: number; // Potasio
}

export class SensorDataDto {
  @IsString()
  device_id: string;

  @IsDateString()
  timestamp: string;

  @ValidateNested()
  @Type(() => SensorDataValuesDto)
  data: SensorDataValuesDto;
}
