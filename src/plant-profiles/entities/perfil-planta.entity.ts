import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';

@Entity('perfiles_planta')
export class PerfilPlanta {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 100, unique: true })
  nombre: string;

  @Column({ type: 'text', nullable: true })
  descripcion: string;

  // Parámetros de temperatura
  @Column({ type: 'decimal', precision: 4, scale: 2, name: 'temperatura_min' })
  temperaturaMin: number;

  @Column({ type: 'decimal', precision: 4, scale: 2, name: 'temperatura_max' })
  temperaturaMax: number;

  @Column({ type: 'decimal', precision: 4, scale: 2, nullable: true, name: 'temperatura_optima' })
  temperaturaOptima: number;

  // Parámetros de humedad
  @Column({ type: 'decimal', precision: 5, scale: 2, name: 'humedad_min' })
  humedadMin: number;

  @Column({ type: 'decimal', precision: 5, scale: 2, name: 'humedad_max' })
  humedadMax: number;

  @Column({ type: 'decimal', precision: 5, scale: 2, nullable: true, name: 'humedad_optima' })
  humedadOptima: number;

  // Parámetros de pH
  @Column({ type: 'decimal', precision: 4, scale: 2, name: 'ph_min' })
  phMin: number;

  @Column({ type: 'decimal', precision: 4, scale: 2, name: 'ph_max' })
  phMax: number;

  @Column({ type: 'decimal', precision: 4, scale: 2, nullable: true, name: 'ph_optimo' })
  phOptimo: number;

  // Parámetros de NPK
  @Column({ type: 'int', name: 'nitrogeno_min' })
  nitrogenoMin: number;

  @Column({ type: 'int', name: 'nitrogeno_max' })
  nitrogenoMax: number;

  @Column({ type: 'int', nullable: true, name: 'nitrogeno_optimo' })
  nitrogenoOptimo: number;

  @Column({ type: 'int', name: 'fosforo_min' })
  fosforoMin: number;

  @Column({ type: 'int', name: 'fosforo_max' })
  fosforoMax: number;

  @Column({ type: 'int', nullable: true, name: 'fosforo_optimo' })
  fosforoOptimo: number;

  @Column({ type: 'int', name: 'potasio_min' })
  potasioMin: number;

  @Column({ type: 'int', name: 'potasio_max' })
  potasioMax: number;

  @Column({ type: 'int', nullable: true, name: 'potasio_optimo' })
  potasioOptimo: number;

  // Parámetros de luz
  @Column({ type: 'int', nullable: true, name: 'luz_min' })
  luzMin: number;

  @Column({ type: 'int', nullable: true, name: 'luz_max' })
  luzMax: number;

  @Column({ type: 'int', nullable: true, name: 'horas_luz_diarias' })
  horasLuzDiarias: number;

  // Parámetros de crecimiento
  @Column({ type: 'int', nullable: true, name: 'dias_germinacion' })
  diasGerminacion: number;

  @Column({ type: 'int', nullable: true, name: 'dias_cosecha' })
  diasCosecha: number;

  // Información adicional
  @Column({ type: 'varchar', length: 50, nullable: true, name: 'tipo_planta' })
  tipoPlanta: string;

  // Imagen del perfil
  @Column({ type: 'bytea', nullable: true })
  imagen?: Buffer;

  @Column({ type: 'varchar', length: 255, nullable: true, name: 'imagen_nombre' })
  imagenNombre?: string;

  @Column({ type: 'varchar', length: 50, nullable: true, name: 'imagen_tipo' })
  imagenTipo?: string;

  @Column({ type: 'int', nullable: true, name: 'imagen_tamaño' })
  imagenTamaño?: number;

  // Campos de auditoría
  @Column({ type: 'boolean', default: true })
  activo: boolean;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}