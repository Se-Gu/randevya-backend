import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { StaffService } from './staff.service';
import { StaffController } from './staff.controller';
import { Staff } from './entities/staff.entity';
import { Appointment } from '../appointments/entities/appointment.entity';
import { Service } from '../services/entities/service.entity';
import { Salon } from '../salons/entities/salon.entity';
import { AnalyticsService } from '../analytics/analytics.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([Staff, Appointment, Service, Salon]),
  ],
  controllers: [StaffController],
  providers: [StaffService, AnalyticsService],
  exports: [StaffService, AnalyticsService],
})
export class StaffModule {}
