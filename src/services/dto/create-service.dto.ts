import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsNumber, Min, IsUUID } from 'class-validator';

export class CreateServiceDto {
  @ApiProperty({
    example: 'Haircut & Blowdry',
    description: 'Name of the service',
  })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({
    example: 60,
    description: 'Duration of the service in minutes',
  })
  @IsNumber()
  @Min(5)
  @IsNotEmpty()
  durationMinutes: number;

  @ApiProperty({ example: 75.0, description: 'Price of the service' })
  @IsNumber()
  @Min(0)
  @IsNotEmpty()
  price: number;

  @ApiProperty({
    example: 's1a2l3o4-n5i6-d789-0123-456789abcdef',
    description: 'ID of the salon offering this service',
  })
  @IsUUID()
  @IsNotEmpty()
  salonId: string;
}
