import { ApiProperty } from '@nestjs/swagger';
import { IsString, Matches } from 'class-validator';

export class TimeSlot {
  @ApiProperty({
    example: '09:00',
    description: 'Start time of the slot (HH:MM)',
  })
  @IsString()
  @Matches(/^([01]\d|2[0-3]):([0-5]\d)$/, {
    message: 'Start time must be in HH:MM format',
  })
  start: string;

  @ApiProperty({
    example: '12:00',
    description: 'End time of the slot (HH:MM)',
  })
  @IsString()
  @Matches(/^([01]\d|2[0-3]):([0-5]\d)$/, {
    message: 'End time must be in HH:MM format',
  })
  end: string;
}
