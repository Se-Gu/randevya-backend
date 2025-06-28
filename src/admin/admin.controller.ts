import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { UsersService } from '../users/users.service';
import { SalonsService } from '../salons/salons.service';
import { UserRole } from '../shared/enums/user-role.enum';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';

@ApiTags('admin')
@Controller('admin')
@UseGuards(AuthGuard('jwt'), RolesGuard)
@Roles(UserRole.SYSTEM_ADMIN)
@ApiBearerAuth()
export class AdminController {
  constructor(
    private readonly usersService: UsersService,
    private readonly salonsService: SalonsService,
  ) {}

  @Get('users')
  @ApiOperation({ summary: 'Get all users (admin only)' })
  @ApiResponse({ status: 200, description: 'Return all users.' })
  findAllUsers() {
    return this.usersService.findAll();
  }

  @Get('salons')
  @ApiOperation({ summary: 'Get all salons (admin only)' })
  @ApiResponse({ status: 200, description: 'Return all salons.' })
  findAllSalons() {
    return this.salonsService.findAll({});
  }

  @Delete('users/:id')
  @ApiOperation({ summary: 'Delete a user (admin only)' })
  @ApiResponse({ status: 200, description: 'User successfully deleted.' })
  @ApiResponse({ status: 404, description: 'User not found.' })
  removeUser(@Param('id') id: string) {
    return this.usersService.remove(id);
  }

  @Delete('salons/:id')
  @ApiOperation({ summary: 'Delete a salon (admin only)' })
  @ApiResponse({ status: 200, description: 'Salon successfully deleted.' })
  @ApiResponse({ status: 404, description: 'Salon not found.' })
  removeSalon(@Param('id') id: string) {
    return this.salonsService.remove(id);
  }
}
