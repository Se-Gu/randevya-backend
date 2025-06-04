import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
} from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { Location } from '../../shared/classes/location.class';
import { WeeklyAvailability } from '../../shared/classes/weekly-availability.class';
import { User } from '../../users/entities';
import { Service } from '../../services/entities';
import { Staff } from '../../staff/entities';
import { Appointment } from '../../appointments/entities';

@Entity('salons')
export class Salon {
  @ApiProperty({
    example: 's1a2l3o4-n5i6-d789-0123-456789abcdef',
    description: 'Unique identifier for the salon',
  })
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ApiProperty({
    example: 'Chic Cuts & Styles',
    description: 'Name of the salon',
  })
  @Column()
  name: string;

  @ApiProperty({
    example: '+15551234567',
    description: 'Contact phone number for the salon',
  })
  @Column()
  phone: string;

  @ApiProperty({
    example: 'contact@chiccuts.com',
    description: 'Contact email for the salon',
  })
  @Column({ unique: true })
  email: string;

  @ApiProperty({
    type: () => Location,
    description: 'Physical location of the salon',
  })
  @Column({ type: 'jsonb' })
  location: Location;

  @ApiProperty({
    type: () => [WeeklyAvailability],
    description: 'General weekly availability of the salon',
  })
  @Column({ type: 'jsonb', array: false, default: () => "'[]'" })
  availability: WeeklyAvailability[];

  @OneToMany(() => User, (user) => user.salon)
  users: User[];

  @OneToMany(() => Service, (service) => service.salon)
  services: Service[];

  @OneToMany(() => Staff, (staff) => staff.salon)
  staffMembers: Staff[];

  @OneToMany(() => Appointment, (appointment) => appointment.salon)
  appointments: Appointment[];

  @ApiProperty()
  @CreateDateColumn()
  createdAt: Date;

  @ApiProperty()
  @UpdateDateColumn()
  updatedAt: Date;
}
