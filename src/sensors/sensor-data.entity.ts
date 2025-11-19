import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
} from 'typeorm';

@Entity('sensor_data')
export class SensorData {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 100 })
  device_id: string;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  timestamp: Date;

  @Column({ type: 'decimal', precision: 5, scale: 2, nullable: true })
  temperature?: number;

  @Column({ type: 'decimal', precision: 5, scale: 2, nullable: true })
  humidity?: number;

  @Column({ type: 'decimal', precision: 4, scale: 2, nullable: true })
  ph?: number;

  @Column({ type: 'decimal', precision: 6, scale: 2, nullable: true })
  conductivity?: number;

  @Column({ type: 'decimal', precision: 6, scale: 2, nullable: true })
  tds?: number;

  @Column({ type: 'decimal', precision: 6, scale: 2, nullable: true })
  n?: number; // Nitrógeno

  @Column({ type: 'decimal', precision: 6, scale: 2, nullable: true })
  p?: number; // Fósforo

  @Column({ type: 'decimal', precision: 6, scale: 2, nullable: true })
  k?: number; // Potasio

  @CreateDateColumn()
  created_at: Date;
}