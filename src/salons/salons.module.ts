import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SalonsService } from './salons.service';
import { SalonsController } from './salons.controller';
import { Salon } from './entities/salon.entity';
import { Service } from '../services/entities/service.entity';
import { StaffModule } from '../staff/staff.module';
import { AppointmentsModule } from '../appointments/appointments.module';
import { CalendarService } from './calendar.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([Salon, Service]),
    StaffModule,
    AppointmentsModule,
  ],
  controllers: [SalonsController],
  providers: [SalonsService, CalendarService],
  exports: [SalonsService, CalendarService],
})
export class SalonsModule {}
