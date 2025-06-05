import { ApiProperty } from '@nestjs/swagger';
import {
  IsString,
  IsEmail,
  IsNotEmpty,
  IsPhoneNumber,
  ValidateNested,
  IsArray,
  IsOptional,
} from 'class-validator';
import { Type } from 'class-transformer';
import { Location } from '../../shared/classes/location.class';
import { WeeklyAvailability } from '../../shared/classes/weekly-availability.class';

export class CreateSalonDto {
  @ApiProperty({
    example: 'Chic Cuts & Styles',
    description: 'Name of the salon',
  })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({
    example: '+15551234567',
    description: 'Contact phone number for the salon',
  })
  @IsPhoneNumber('US')
  @IsNotEmpty()
  phone: string;

  @ApiProperty({
    example: 'contact@chiccuts.com',
    description: 'Contact email for the salon',
  })
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @ApiProperty({
    type: () => Location,
    description: 'Physical location of the salon',
  })
  @ValidateNested()
  @Type(() => Location)
  @IsNotEmpty()
  location: Location;

  @ApiProperty({
    type: () => [WeeklyAvailability],
    description: 'General weekly availability of the salon',
    required: false,
  })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => WeeklyAvailability)
  @IsOptional()
  weeklyAvailability?: WeeklyAvailability[];
}
