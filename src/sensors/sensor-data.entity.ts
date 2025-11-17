import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity('sensor_data')
export class SensorData {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 50 })
  device_id: string;

  @Column({ type: 'timestamp' })
  timestamp: Date;

  @Column({ type: 'float', nullable: true })
  temperature: number;

  @Column({ type: 'float', nullable: true })
  humidity: number;

  @Column({ type: 'int', nullable: true })
  conductivity: number;

  @Column({ type: 'float', nullable: true })
  ph: number;

  @Column({ type: 'int', nullable: true })
  tds: number;
}
