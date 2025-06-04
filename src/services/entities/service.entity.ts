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
import { Salon } from '../../salons/entities';
import { Appointment } from '../../appointments/entities';

@Entity('services')
export class Service {
  @ApiProperty({
    example: 'svc1a2b3-c4d5-e6f7-g8h9-i0j1k2l3m4n5',
    description: 'Unique identifier for the service',
  })
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ApiProperty({
    example: 'Haircut & Blowdry',
    description: 'Name of the service',
  })
  @Column()
  name: string;

  @ApiProperty({
    example: 60,
    description: 'Duration of the service in minutes',
  })
  @Column()
  durationMinutes: number;

  @ApiProperty({ example: 75.0, description: 'Price of the service' })
  @Column('decimal', { precision: 10, scale: 2 })
  price: number;

  @ApiProperty({
    example: 's1a2l3o4-n5i6-d789-0123-456789abcdef',
    description: 'ID of the salon offering this service',
  })
  @Column('uuid')
  salonId: string;

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
