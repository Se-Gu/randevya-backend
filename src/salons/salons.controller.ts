import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Request,
  Query,
} from '@nestjs/common';
import { SalonsService } from './salons.service';
import { CalendarService, CalendarView } from './calendar.service';
import { AnalyticsService, SalonMetrics } from '../analytics/analytics.service';
import { CreateSalonDto } from './dto/create-salon.dto';
import { UpdateSalonDto } from './dto/update-salon.dto';
import { ListSalonsDto } from './dto/list-salons.dto';
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

@ApiTags('salons')
@Controller('salons')
export class SalonsController {
  constructor(
    private readonly salonsService: SalonsService,
    private readonly calendarService: CalendarService,
    private readonly analyticsService: AnalyticsService,
  ) {}

  @Post()
  @ApiOperation({ summary: 'Create a new salon' })
  @ApiResponse({ status: 201, description: 'Salon successfully created.' })
  @ApiResponse({ status: 400, description: 'Bad request.' })
  create(@Body() createSalonDto: CreateSalonDto) {
    return this.salonsService.create(createSalonDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all salons (public)' })
  @ApiResponse({ status: 200, description: 'Return salons with pagination.' })
  findAll(@Query() query: ListSalonsDto) {
    return this.salonsService.findAll(query);
  }

  @Get('me')
  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get current salon details' })
  @ApiResponse({ status: 200, description: 'Return the current salon.' })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  getMe(@Request() req) {
    return this.salonsService.findOne(req.user.salonId);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get salon details (public)' })
  @ApiResponse({ status: 200, description: 'Return the salon.' })
  @ApiResponse({ status: 404, description: 'Salon not found.' })
  findOne(@Param('id') id: string) {
    return this.salonsService.findOne(id);
  }

  @Get(':id/services')
  @ApiOperation({ summary: 'Get salon services (public)' })
  @ApiResponse({ status: 200, description: 'Return salon services.' })
  @ApiResponse({ status: 404, description: 'Salon not found.' })
  findServices(@Param('id') id: string) {
    return this.salonsService.findServices(id);
  }

  @Get(':id/availability')
  @ApiOperation({ summary: 'Get salon availability (public)' })
  @ApiResponse({ status: 200, description: 'Return salon availability.' })
  @ApiResponse({ status: 404, description: 'Salon not found.' })
  findAvailability(@Param('id') id: string) {
    return this.salonsService.findAvailability(id);
  }

  @Get(':id/calendar')
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles(UserRole.OWNER)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get aggregated salon calendar (owner only)' })
  @ApiResponse({ status: 200, description: 'Return salon calendar.' })
  getCalendar(
    @Param('id') id: string,
    @Query('view') view: CalendarView = 'month',
  ) {
    const calendarView: CalendarView =
      view === 'day' || view === 'week' || view === 'month' ? view : 'month';
    return this.calendarService.getSalonCalendar(id, calendarView);
  }

  @Get(':id/metrics')
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles(UserRole.OWNER)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get analytics for a salon (owner only)' })
  @ApiResponse({ status: 200, description: 'Return salon metrics.' })
  getMetrics(@Param('id') id: string): Promise<SalonMetrics> {
    return this.analyticsService.getSalonMetrics(id);
  }

  @Patch(':id')
  @UseGuards(AuthGuard('jwt'), OwnerGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update salon (salon owner only)' })
  @ApiResponse({ status: 200, description: 'Salon successfully updated.' })
  @ApiResponse({ status: 404, description: 'Salon not found.' })
  update(@Param('id') id: string, @Body() updateSalonDto: UpdateSalonDto) {
    return this.salonsService.update(id, updateSalonDto);
  }

  @Delete(':id')
  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Delete salon (admin only)' })
  @ApiResponse({ status: 200, description: 'Salon successfully deleted.' })
  @ApiResponse({ status: 404, description: 'Salon not found.' })
  remove(@Param('id') id: string) {
    return this.salonsService.remove(id);
  }
}
