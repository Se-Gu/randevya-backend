import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { AppointmentStatus } from '../../shared/enums/appointment-status.enum';
import { Salon } from '../../salons/entities';
import { Service } from '../../services/entities';
import { Staff } from '../../staff/entities';

@Entity('appointments')
export class Appointment {
  @ApiProperty({
    example: 'apt1a2b3-c4d5-e6f7-g8h9-i0j1k2l3m4n5',
    description: 'Unique identifier for the appointment',
  })
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ApiProperty({
    example: 'John Customer',
    description: 'Name of the customer',
  })
  @Column()
  customerName: string;

  @ApiProperty({
    example: '+15559876543',
    description: 'Phone number of the customer',
  })
  @Column()
  customerPhone: string;

  @ApiProperty({
    example: 'customer@example.com',
    description: 'Email of the customer (optional)',
    required: false,
  })
  @Column({ nullable: true })
  customerEmail?: string;

  @ApiProperty({
    example: '2025-06-15',
    description: 'Date of the appointment (ISO format YYYY-MM-DD)',
  })
  @Column('date')
  date: string;

  @ApiProperty({
    example: '15:30',
    description: 'Time of the appointment (HH:MM)',
  })
  @Column('time')
  time: string;

  @ApiProperty({
    enum: AppointmentStatus,
    example: AppointmentStatus.PENDING,
    description: 'Status of the appointment',
  })
  @Column({
    type: 'enum',
    enum: AppointmentStatus,
    default: AppointmentStatus.PENDING,
  })
  status: AppointmentStatus;

  @ApiProperty({
    example: 'tok_a1b2c3d4-e5f6-7890-1234-567890abcdef',
    description: 'Unique access token for customer to manage appointment',
  })
  @Column({ unique: true })
  accessToken: string;

  @ApiProperty({
    example: 's1a2l3o4-n5i6-d789-0123-456789abcdef',
    description: 'ID of the salon for the appointment',
  })
  @Column('uuid')
  salonId: string;

  @ManyToOne(() => Salon, (salon) => salon.appointments, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'salonId' })
  salon: Salon;

  @ApiProperty({
    example: 'svc1a2b3-c4d5-e6f7-g8h9-i0j1k2l3m4n5',
    description: 'ID of the service for the appointment',
  })
  @Column('uuid')
  serviceId: string;

  @ManyToOne(() => Service, (service) => service.appointments, {
    onDelete: 'SET NULL',
  })
  @JoinColumn({ name: 'serviceId' })
  service: Service;

  @ApiProperty({
    example: 'stf1a2b3-c4d5-e6f7-g8h9-i0j1k2l3m4n5',
    description: 'ID of the staff member for the appointment (optional)',
    required: false,
  })
  @Column('uuid', { nullable: true })
  staffId?: string;

  @ManyToOne(() => Staff, (staff) => staff.appointments, {
    nullable: true,
    onDelete: 'SET NULL',
  })
  @JoinColumn({ name: 'staffId' })
  staff?: Staff;

  @ApiProperty()
  @CreateDateColumn()
  createdAt: Date;

  @ApiProperty()
  @UpdateDateColumn()
  updatedAt: Date;
}
