import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity('sensor_data')
export class SensorData {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 50, nullable: true })
  device_id: string | null;

  @Column({ type: 'timestamp' })
  timestamp: Date;

  @Column({ type: 'decimal', precision: 5, scale: 2, nullable: true })
  temperature: number;

  @Column({ type: 'decimal', precision: 5, scale: 2, nullable: true })
  humidity: number;

  @Column({ type: 'decimal', precision: 4, scale: 2, nullable: true })
  ph: number;

  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true })
  conductivity: number;

  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true })
  tds: number;

  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true })
  n: number; // Nitrógeno (N)

  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true })
  p: number; // Fósforo (P)

  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true })
  k: number; // Potasio (K)

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  created_at: Date;
}
