import { ApiProperty } from '@nestjs/swagger';
import {
  IsString,
  IsEmail,
  IsNotEmpty,
  MinLength,
  IsEnum,
  IsUUID,
} from 'class-validator';
import { UserRole } from '../../shared/enums/user-role.enum';

export class CreateUserDto {
  @ApiProperty({ example: 'John Doe', description: 'Name of the user' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({
    example: 'john.doe@example.com',
    description: 'Email of the user (used for login)',
  })
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @ApiProperty({
    example: 'Str0ngP@sswOrd!',
    description: 'Password for the user account',
  })
  @IsString()
  @IsNotEmpty()
  @MinLength(8, { message: 'Password must be at least 8 characters long' })
  password: string;

  @ApiProperty({
    enum: UserRole,
    example: UserRole.STAFF,
    description: 'Role of the user',
  })
  @IsEnum(UserRole)
  @IsNotEmpty()
  role: UserRole;

  @ApiProperty({
    example: 's1a2l3o4-n5i6-d789-0123-456789abcdef',
    description: 'ID of the salon this user belongs to',
  })
  @IsUUID()
  @IsNotEmpty()
  salonId: string;
}
