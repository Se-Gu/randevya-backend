import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsLatitude, IsLongitude } from 'class-validator';

export class Location {
  @ApiProperty({
    example: '123 Main St, Anytown, USA',
    description: 'Full address of the salon',
  })
  @IsString()
  @IsNotEmpty()
  address: string;

  @ApiProperty({
    example: 34.0522,
    description: 'Latitude of the salon location',
  })
  @IsLatitude()
  @IsNotEmpty()
  lat: number;

  @ApiProperty({
    example: -118.2437,
    description: 'Longitude of the salon location',
  })
  @IsLongitude()
  @IsNotEmpty()
  lng: number;
}
