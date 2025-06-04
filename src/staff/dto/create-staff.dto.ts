import { ApiProperty } from '@nestjs/swagger';
import {
  IsString,
  IsNotEmpty,
  IsArray,
  ValidateNested,
  IsUUID,
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
}
