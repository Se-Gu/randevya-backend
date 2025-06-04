import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsEnum, IsArray, ValidateNested } from 'class-validator';
import { DayOfWeek } from '../enums/days-of-week.enum';
import { TimeSlot } from './time-slot.class';

export class WeeklyAvailability {
  @ApiProperty({
    enum: DayOfWeek,
    example: DayOfWeek.MONDAY,
    description: 'Day of the week',
  })
  @IsEnum(DayOfWeek)
  day: DayOfWeek;

  @ApiProperty({
    type: [TimeSlot],
    description: 'Array of available time slots for the day',
  })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => TimeSlot)
  slots: TimeSlot[];
}
