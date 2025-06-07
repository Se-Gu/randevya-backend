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
import { ServicesService } from './services.service';
import { CreateServiceDto } from './dto/create-service.dto';
import { UpdateServiceDto } from './dto/update-service.dto';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { OwnerGuard } from '../auth/guards/owner.guard';

@ApiTags('services')
@Controller('services')
export class ServicesController {
  constructor(private readonly servicesService: ServicesService) {}

  @Post()
  @UseGuards(AuthGuard('jwt'), OwnerGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create a new service (salon only)' })
  @ApiResponse({ status: 201, description: 'Service successfully created.' })
  @ApiResponse({ status: 400, description: 'Bad request.' })
  create(@Body() createServiceDto: CreateServiceDto) {
    return this.servicesService.create(createServiceDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all services (public)' })
  @ApiResponse({ status: 200, description: 'Return all services.' })
  findAll() {
    return this.servicesService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get service details (public)' })
  @ApiResponse({ status: 200, description: 'Return the service.' })
  @ApiResponse({ status: 404, description: 'Service not found.' })
  findOne(@Param('id') id: string) {
    return this.servicesService.findOne(id);
  }

  @Get('salon/:salonId')
  @ApiOperation({ summary: 'Get all services for a salon (public)' })
  @ApiResponse({
    status: 200,
    description: 'Return all services for the salon.',
  })
  @ApiResponse({ status: 404, description: 'Salon not found.' })
  findBySalon(@Param('salonId') salonId: string) {
    return this.servicesService.findBySalon(salonId);
  }

  @Patch(':id')
  @UseGuards(AuthGuard('jwt'), OwnerGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update service (salon only)' })
  @ApiResponse({ status: 200, description: 'Service successfully updated.' })
  @ApiResponse({ status: 404, description: 'Service not found.' })
  update(@Param('id') id: string, @Body() updateServiceDto: UpdateServiceDto) {
    return this.servicesService.update(id, updateServiceDto);
  }

  @Delete(':id')
  @UseGuards(AuthGuard('jwt'), OwnerGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Delete service (salon only)' })
  @ApiResponse({ status: 200, description: 'Service successfully deleted.' })
  @ApiResponse({ status: 404, description: 'Service not found.' })
  remove(@Param('id') id: string) {
    return this.servicesService.remove(id);
  }
}
