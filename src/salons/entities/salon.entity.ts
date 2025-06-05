import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
} from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { Service } from '../../services/entities/service.entity';
import { Staff } from '../../staff/entities/staff.entity';
import { WeeklyAvailability } from '../../shared/types/weekly-availability.type';
import { Appointment } from '../../appointments/entities/appointment.entity';
import { User } from '../../users/entities/user.entity';

@Entity('salons')
export class Salon {
  @ApiProperty({
    example: 'a1b2c3d4-e5f6-7890-1234-567890abcdef',
    description: 'Unique identifier for the salon',
  })
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ApiProperty({ example: 'Hair Studio', description: 'Name of the salon' })
  @Column()
  name: string;

  @ApiProperty({
    example: '+1234567890',
    description: 'Phone number of the salon',
  })
  @Column()
  phone: string;

  @ApiProperty({
    example: 'salon@example.com',
    description: 'Email of the salon',
  })
  @Column()
  email: string;

  @ApiProperty({
    example: {
      address: '123 Main St, City, Country',
      lat: 40.7128,
      lng: -74.006,
    },
    description: 'Location of the salon',
  })
  @Column('jsonb')
  location: {
    address: string;
    lat: number;
    lng: number;
  };

  @ApiProperty({
    description: 'Weekly availability of the salon',
  })
  @Column('jsonb')
  weeklyAvailability: WeeklyAvailability[];

  @OneToMany(() => Service, (service) => service.salon)
  services: Service[];

  @OneToMany(() => Staff, (staff) => staff.salon)
  staff: Staff[];

  @OneToMany(() => Appointment, (appointment) => appointment.salon)
  appointments: Appointment[];

  @OneToMany(() => User, (user) => user.salon)
  users: User[];

  @ApiProperty()
  @CreateDateColumn()
  createdAt: Date;

  @ApiProperty()
  @UpdateDateColumn()
  updatedAt: Date;
}
