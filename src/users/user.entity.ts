import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn } from 'typeorm';

export enum TipoUsuario {
  ADMINISTRADOR = 'administrador',
  ESTUDIANTE = 'estudiante',
  MANTENIMIENTO = 'mantenimiento',
}

@Entity('usuarios')
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  email: string;

  @Column({ name: 'password_hash' })
  passwordHash: string;

  @Column()
  nombre: string;

  @Column()
  apellido: string;

  @Column({
    type: 'varchar',
    length: 20,
    name: 'tipo_usuario',
  })
  tipoUsuario: TipoUsuario;

  @Column({ default: true })
  activo: boolean;

  @CreateDateColumn({ name: 'fecha_creacion' })
  fechaCreacion: Date;

  @UpdateDateColumn({ name: 'fecha_actualizacion' })
  fechaActualizacion: Date;
}