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
import { WeeklyAvailability } from '../../shared/classes/weekly-availability.class';
import { Salon } from '../../salons/entities';
import { Appointment } from '../../appointments/entities';

@Entity('staff')
export class Staff {
  @ApiProperty({
    example: 'stf1a2b3-c4d5-e6f7-g8h9-i0j1k2l3m4n5',
    description: 'Unique identifier for the staff member',
  })
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ApiProperty({
    example: 'Jane Smith',
    description: 'Name of the staff member',
  })
  @Column()
  name: string;

  @ApiProperty({
    type: () => [WeeklyAvailability],
    description: 'Working hours of the staff member',
  })
  @Column({ type: 'jsonb', array: false, default: () => "'[]'" })
  workingHours: WeeklyAvailability[];

  @ApiProperty({
    example: 's1a2l3o4-n5i6-d789-0123-456789abcdef',
    description: 'ID of the salon this staff member belongs to',
  })
  @Column('uuid')
  salonId: string;

  @ManyToOne(() => Salon, (salon) => salon.staffMembers, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'salonId' })
  salon: Salon;

  @OneToMany(() => Appointment, (appointment) => appointment.staff)
  appointments: Appointment[];

  @ApiProperty()
  @CreateDateColumn()
  createdAt: Date;

  @ApiProperty()
  @UpdateDateColumn()
  updatedAt: Date;
}
