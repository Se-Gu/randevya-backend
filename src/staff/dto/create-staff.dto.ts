import { ApiProperty } from '@nestjs/swagger';
import {
  IsString,
  IsNotEmpty,
  IsArray,
  ValidateNested,
  IsUUID,
  IsOptional,
} from 'class-validator';
import { Type } from 'class-transformer';
import { WeeklyAvailability } from '../../shared/classes/weekly-availability.class';

export class CreateStaffDto {
  @ApiProperty({
    example: 'Jane Smith',
    description: 'Name of the staff member',
  })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({
    type: () => [WeeklyAvailability],
    description: 'Working hours of the staff member',
  })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => WeeklyAvailability)
  workingHours: WeeklyAvailability[];

  @ApiProperty({
    example: 's1a2l3o4-n5i6-d789-0123-456789abcdef',
    description: 'ID of the salon this staff member belongs to',
  })
  @IsUUID()
  @IsNotEmpty()
  salonId: string;

  @ApiProperty({
    example: 'usr1a2b3-c4d5-e6f7-g8h9-i0j1k2l3m4n5',
    description: 'ID of the user associated with this staff member',
    required: false,
  })
  @IsUUID()
  @IsOptional()
  userId?: string;
}
