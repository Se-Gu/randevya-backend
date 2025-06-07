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
import { StaffService } from './staff.service';
import { CreateStaffDto } from './dto/create-staff.dto';
import { UpdateStaffDto } from './dto/update-staff.dto';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { OwnerGuard } from '../auth/guards/owner.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { UserRole } from '../shared/enums/user-role.enum';
import { AnalyticsService } from '../analytics/analytics.service';


@ApiTags('staff')
@Controller('staff')
export class StaffController {
  constructor(
    private readonly staffService: StaffService,
    private readonly analyticsService: AnalyticsService,
  ) {}

  @Post()
  @UseGuards(AuthGuard('jwt'), OwnerGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create a new staff member (salon only)' })
  @ApiResponse({
    status: 201,
    description: 'Staff member successfully created.',
  })
  @ApiResponse({ status: 400, description: 'Bad request.' })
  create(@Body() createStaffDto: CreateStaffDto) {
    return this.staffService.create(createStaffDto);
  }

  @Get()
  @UseGuards(AuthGuard('jwt'), OwnerGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get all staff members (salon only)' })
  @ApiResponse({ status: 200, description: 'Return all staff members.' })
  findAll() {
    return this.staffService.findAll();
  }

  @Get(':id')
  @UseGuards(AuthGuard('jwt'), OwnerGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get staff member details (salon only)' })
  @ApiResponse({ status: 200, description: 'Return the staff member.' })
  @ApiResponse({ status: 404, description: 'Staff member not found.' })
  findOne(@Param('id') id: string) {
    return this.staffService.findOne(id);
  }

  @Get(':id/metrics')
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles(UserRole.OWNER)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get analytics for a staff member (owner only)' })
  @ApiResponse({ status: 200, description: 'Return metrics for the staff member.' })
  getMetrics(@Param('id') id: string) {
    return this.analyticsService.getStaffMetrics(id);
  }

  @Get('salon/:salonId')
  @ApiOperation({ summary: 'Get all staff members for a salon (public)' })
  @ApiResponse({
    status: 200,
    description: 'Return all staff members for the salon.',
  })
  @ApiResponse({ status: 404, description: 'Salon not found.' })
  findBySalon(@Param('salonId') salonId: string) {
    return this.staffService.findBySalon(salonId);
  }

  @Patch(':id')
  @UseGuards(AuthGuard('jwt'), OwnerGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update staff member (salon only)' })
  @ApiResponse({
    status: 200,
    description: 'Staff member successfully updated.',
  })
  @ApiResponse({ status: 404, description: 'Staff member not found.' })
  update(@Param('id') id: string, @Body() updateStaffDto: UpdateStaffDto) {
    return this.staffService.update(id, updateStaffDto);
  }

  @Delete(':id')
  @UseGuards(AuthGuard('jwt'), OwnerGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Delete staff member (salon only)' })
  @ApiResponse({
    status: 200,
    description: 'Staff member successfully deleted.',
  })
  @ApiResponse({ status: 404, description: 'Staff member not found.' })
  remove(@Param('id') id: string) {
    return this.staffService.remove(id);
  }
}
