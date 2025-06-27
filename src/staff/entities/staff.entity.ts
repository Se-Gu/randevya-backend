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
import { WeeklyAvailability } from '../../shared/types/weekly-availability.type';
import { Appointment } from '../../appointments/entities/appointment.entity';
import { User } from '../../users/entities/user.entity';

@Entity('staff')
export class Staff {
  @ApiProperty({
    example: 'a1b2c3d4-e5f6-7890-1234-567890abcdef',
    description: 'Unique identifier for the staff member',
  })
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ApiProperty({
    example: 's1a2l3o4-n5i6-d789-0123-456789abcdef',
    description: 'ID of the salon this staff member belongs to',
  })
  @Column('uuid')
  salonId: string;

  @ApiProperty({
    example: 'usr1a2b3-c4d5-e6f7-g8h9-i0j1k2l3m4n5',
    description: 'ID of the user associated with this staff member',
    required: false,
  })
  @Column('uuid', { nullable: true })
  userId?: string;

  @ApiProperty({ example: 'John Doe', description: 'Name of the staff member' })
  @Column()
  name: string;

  @ApiProperty({
    description: 'Working hours of the staff member',
  })
  @Column('jsonb')
  workingHours: WeeklyAvailability[];

  @ManyToOne(() => Salon, (salon) => salon.staff, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'salonId' })
  salon: Salon;

  @ManyToOne(() => User, { nullable: true, onDelete: 'SET NULL' })
  @JoinColumn({ name: 'userId' })
  user?: User;

  @OneToMany(() => Appointment, (appointment) => appointment.staff)
  appointments: Appointment[];

  @ApiProperty()
  @CreateDateColumn()
  createdAt: Date;

  @ApiProperty()
  @UpdateDateColumn()
  updatedAt: Date;
}
