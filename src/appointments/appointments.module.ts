import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppointmentsService } from './appointments.service';
import { AppointmentsController } from './appointments.controller';
import { Appointment } from './entities/appointment.entity';
import { SalonsModule } from '../salons/salons.module';
import { ServicesModule } from '../services/services.module';
import { StaffModule } from '../staff/staff.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Appointment]),
    SalonsModule,
    ServicesModule,
    StaffModule,
  ],
  controllers: [AppointmentsController],
  providers: [AppointmentsService],
  exports: [AppointmentsService],
})
export class AppointmentsModule {}
