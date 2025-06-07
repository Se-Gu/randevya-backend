import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Query,
} from '@nestjs/common';
import { AppointmentsService } from './appointments.service';
import { CreateAppointmentDto } from './dto/create-appointment.dto';
import { UpdateAppointmentDto } from './dto/update-appointment.dto';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { StaffGuard } from '../auth/guards/staff.guard';
import { AccessTokenGuard } from '../auth/guards/access-token.guard';

@ApiTags('appointments')
@Controller('appointments')
export class AppointmentsController {
  constructor(private readonly appointmentsService: AppointmentsService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new appointment (public)' })
  @ApiResponse({
    status: 201,
    description: 'Appointment successfully created.',
  })
  @ApiResponse({ status: 400, description: 'Bad request.' })
  create(@Body() createAppointmentDto: CreateAppointmentDto) {
    return this.appointmentsService.create(createAppointmentDto);
  }

  @Get()
  @UseGuards(AuthGuard('jwt'), StaffGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get all appointments (salon only)' })
  @ApiResponse({ status: 200, description: 'Return all appointments.' })
  findAll() {
    return this.appointmentsService.findAll();
  }

  @Get('token/:token')
  @UseGuards(AccessTokenGuard)
  @ApiOperation({ summary: 'Get appointment details with access token' })
  @ApiResponse({ status: 200, description: 'Return the appointment.' })
  @ApiResponse({ status: 404, description: 'Appointment not found.' })
  findByAccessToken(@Param('token') token: string) {
    return this.appointmentsService.findByAccessToken(token);
  }

  @Get(':id')
  @UseGuards(AuthGuard('jwt'), StaffGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get appointment by ID (salon only)' })
  @ApiResponse({ status: 200, description: 'Return the appointment.' })
  @ApiResponse({ status: 404, description: 'Appointment not found.' })
  findOne(@Param('id') id: string) {
    return this.appointmentsService.findOne(id);
  }

  @Patch(':id')
  @UseGuards(AuthGuard('jwt'), StaffGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update appointment (salon only)' })
  @ApiResponse({
    status: 200,
    description: 'Appointment successfully updated.',
  })
  @ApiResponse({ status: 404, description: 'Appointment not found.' })
  update(
    @Param('id') id: string,
    @Body() updateAppointmentDto: UpdateAppointmentDto,
  ) {
    return this.appointmentsService.update(id, updateAppointmentDto);
  }

  @Delete(':id')
  @UseGuards(AccessTokenGuard)
  @ApiOperation({ summary: 'Cancel appointment with access token' })
  @ApiResponse({
    status: 200,
    description: 'Appointment successfully cancelled.',
  })
  @ApiResponse({ status: 404, description: 'Appointment not found.' })
  remove(@Param('id') id: string, @Query('token') token: string) {
    return this.appointmentsService.remove(id);
  }
}
