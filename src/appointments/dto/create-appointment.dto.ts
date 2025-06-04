import { ApiProperty } from '@nestjs/swagger';
import {
  IsString,
  IsNotEmpty,
  IsEmail,
  IsOptional,
  Matches,
  IsUUID,
  IsPhoneNumber,
} from 'class-validator';

export class CreateAppointmentDto {
  @ApiProperty({
    example: 's1a2l3o4-n5i6-d789-0123-456789abcdef',
    description: 'ID of the salon for the appointment',
  })
  @IsUUID()
  @IsNotEmpty()
  salonId: string;

  @ApiProperty({
    example: 'svc1a2b3-c4d5-e6f7-g8h9-i0j1k2l3m4n5',
    description: 'ID of the service for the appointment',
  })
  @IsUUID()
  @IsNotEmpty()
  serviceId: string;

  @ApiProperty({
    example: 'stf1a2b3-c4d5-e6f7-g8h9-i0j1k2l3m4n5',
    description: 'ID of the staff member (optional)',
    required: false,
  })
  @IsUUID()
  @IsOptional()
  staffId?: string;

  @ApiProperty({
    example: 'John Customer',
    description: 'Name of the customer',
  })
  @IsString()
  @IsNotEmpty()
  customerName: string;

  @ApiProperty({
    example: '+15559876543',
    description: 'Phone number of the customer',
  })
  @IsPhoneNumber('US')
  @IsNotEmpty()
  customerPhone: string;

  @ApiProperty({
    example: 'customer@example.com',
    description: 'Email of the customer (optional)',
    required: false,
  })
  @IsEmail()
  @IsOptional()
  customerEmail?: string;

  @ApiProperty({
    example: '2025-06-15',
    description: 'Date of the appointment (YYYY-MM-DD)',
  })
  @IsString()
  @Matches(/^\d{4}-\d{2}-\d{2}$/, {
    message: 'Date must be in YYYY-MM-DD format',
  })
  @IsNotEmpty()
  date: string;

  @ApiProperty({
    example: '15:30',
    description: 'Time of the appointment (HH:MM)',
  })
  @IsString()
  @Matches(/^([01]\d|2[0-3]):([0-5]\d)$/, {
    message: 'Time must be in HH:MM format',
  })
  @IsNotEmpty()
  time: string;
}
