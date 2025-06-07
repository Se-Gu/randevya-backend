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
} from '@nestjs/common';
import { SalonsService } from './salons.service';
import { CreateSalonDto } from './dto/create-salon.dto';
import { UpdateSalonDto } from './dto/update-salon.dto';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { OwnerGuard } from '../auth/guards/owner.guard';

@ApiTags('salons')
@Controller('salons')
export class SalonsController {
  constructor(private readonly salonsService: SalonsService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new salon' })
  @ApiResponse({ status: 201, description: 'Salon successfully created.' })
  @ApiResponse({ status: 400, description: 'Bad request.' })
  create(@Body() createSalonDto: CreateSalonDto) {
    return this.salonsService.create(createSalonDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all salons (public)' })
  @ApiResponse({ status: 200, description: 'Return all salons.' })
  findAll() {
    return this.salonsService.findAll();
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

  @Get('me')
  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get current salon details' })
  @ApiResponse({ status: 200, description: 'Return the current salon.' })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  getMe(@Request() req) {
    return this.salonsService.findOne(req.user.salonId);
  }
}
