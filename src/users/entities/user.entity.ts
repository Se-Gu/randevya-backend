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
import { UserRole } from '../../shared/enums/user-role.enum';
import { Salon } from '../../salons/entities';

@Entity('users')
export class User {
  @ApiProperty({
    example: 'a1b2c3d4-e5f6-7890-1234-567890abcdef',
    description: 'Unique identifier for the user',
  })
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ApiProperty({ example: 'John Doe', description: 'Name of the user' })
  @Column()
  name: string;

  @ApiProperty({
    example: 'john.doe@example.com',
    description: 'Email of the user (used for login)',
  })
  @Column({ unique: true })
  email: string;

  @Column()
  passwordHash: string;

  @ApiProperty({
    enum: UserRole,
    example: UserRole.STAFF,
    description: 'Role of the user within the salon',
  })
  @Column({
    type: 'enum',
    enum: UserRole,
  })
  role: UserRole;

  @ApiProperty({
    example: 's1a2l3o4-n5i6-d789-0123-456789abcdef',
    description: 'ID of the salon this user belongs to',
  })
  @Column('uuid')
  salonId: string;

  @ManyToOne(() => Salon, (salon) => salon.users, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'salonId' })
  salon: Salon;

  @ApiProperty()
  @CreateDateColumn()
  createdAt: Date;

  @ApiProperty()
  @UpdateDateColumn()
  updatedAt: Date;
}
