import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
  OneToMany,
} from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { Salon } from '../../salons/entities/salon.entity';
import { Appointment } from '../../appointments/entities/appointment.entity';

@Entity('services')
export class Service {
  @ApiProperty({
    example: 'a1b2c3d4-e5f6-7890-1234-567890abcdef',
    description: 'Unique identifier for the service',
  })
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ApiProperty({
    example: 's1a2l3o4-n5i6-d789-0123-456789abcdef',
    description: 'ID of the salon this service belongs to',
  })
  @Column('uuid')
  salonId: string;

  @ApiProperty({ example: 'Haircut', description: 'Name of the service' })
  @Column()
  name: string;

  @ApiProperty({
    example: 30,
    description: 'Duration of the service in minutes',
  })
  @Column()
  durationMinutes: number;

  @ApiProperty({
    example: 50.0,
    description: 'Price of the service',
  })
  @Column('decimal', { precision: 10, scale: 2 })
  price: number;

  @ManyToOne(() => Salon, (salon) => salon.services, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'salonId' })
  salon: Salon;

  @OneToMany(() => Appointment, (appointment) => appointment.service)
  appointments: Appointment[];

  @ApiProperty()
  @CreateDateColumn()
  createdAt: Date;

  @ApiProperty()
  @UpdateDateColumn()
  updatedAt: Date;
}
