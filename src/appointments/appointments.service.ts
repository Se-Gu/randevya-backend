import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Appointment } from './entities/appointment.entity';
import { CreateAppointmentDto } from './dto/create-appointment.dto';
import { UpdateAppointmentDto } from './dto/update-appointment.dto';
import { v4 as uuidv4 } from 'uuid';
import { Staff } from '../staff/entities';
import { StaffService } from '../staff/staff.service';
import { NotificationService } from '../notifications/notification.service';

@Injectable()
export class AppointmentsService {
  constructor(
    @InjectRepository(Appointment)
    private readonly appointmentRepository: Repository<Appointment>,
    @InjectRepository(Staff)
    private readonly staffRepository: Repository<Staff>,
    private readonly staffService: StaffService,
    private readonly notificationService: NotificationService,
  ) {}

  async create(
    createAppointmentDto: CreateAppointmentDto,
  ): Promise<Appointment> {
    const { staffId, salonId, date, time } = createAppointmentDto;

    let selectedStaffId = staffId;

    if (staffId) {
      const staff = await this.staffRepository.findOne({
        where: { id: staffId },
      });
      if (!staff) {
        throw new NotFoundException(
          `Staff member with ID ${staffId} not found`,
        );
      }
      if (staff.salonId !== salonId) {
        throw new BadRequestException(
          'Staff member does not belong to the specified salon',
        );
      }

      const appointmentDay = new Date(date).toLocaleString('en-US', {
        weekday: 'long',
        timeZone: 'UTC',
      });
      const workingDay = staff.workingHours.find(
        (wh) => wh.day === appointmentDay,
      );

      const withinWorkingHours =
        workingDay?.slots.some(
          (slot) => slot.start <= time && time < slot.end,
        ) ?? false;

      if (!withinWorkingHours) {
        throw new BadRequestException(
          'Requested time is outside of staff working hours',
        );
      }

      const conflict = await this.appointmentRepository.findOne({
        where: { staffId, date, time },
      });

      if (conflict) {
        throw new BadRequestException(
          'Staff already has an appointment at the requested time',
        );
      }
    } else {
      const staffMembers = await this.staffService.findBySalon(salonId);

      for (const staff of staffMembers) {
        const appointmentDay = new Date(date).toLocaleString('en-US', {
          weekday: 'long',
          timeZone: 'UTC',
        });
        const workingDay = staff.workingHours.find((wh) => wh.day === appointmentDay);

        const withinWorkingHours =
          workingDay?.slots.some((slot) => slot.start <= time && time < slot.end) ?? false;

        if (!withinWorkingHours) {
          continue;
        }

        const booked = await this.staffService.getBookedSlots(staff.id, 'day', date);

        const hasConflict = booked.some((b) => b.time === time);

        if (!hasConflict) {
          selectedStaffId = staff.id;
          break;
        }
      }

      if (!selectedStaffId) {
        throw new BadRequestException('No available staff at the requested time');
      }
      createAppointmentDto.staffId = selectedStaffId;
    }

    const appointment = this.appointmentRepository.create({
      ...createAppointmentDto,
      accessToken: uuidv4(),
    });
    const saved = await this.appointmentRepository.save(appointment);
    await this.notifyAppointment('created', saved);
    return saved;
  }

  async findAll(): Promise<Appointment[]> {
    return await this.appointmentRepository.find();
  }

  async findOne(id: string): Promise<Appointment> {
    const appointment = await this.appointmentRepository.findOne({
      where: { id },
    });
    if (!appointment) {
      throw new NotFoundException(`Appointment with ID ${id} not found`);
    }
    return appointment;
  }

  async findByAccessToken(accessToken: string): Promise<Appointment> {
    const appointment = await this.appointmentRepository.findOne({
      where: { accessToken },
    });
    if (!appointment) {
      throw new NotFoundException(
        `Appointment with access token ${accessToken} not found`,
      );
    }
    return appointment;
  }

  async findBySalon(salonId: string): Promise<Appointment[]> {
    return await this.appointmentRepository.find({
      where: { salonId },
    });
  }

  async update(
    id: string,
    updateAppointmentDto: UpdateAppointmentDto,
  ): Promise<Appointment> {
    const appointment = await this.findOne(id);
    Object.assign(appointment, updateAppointmentDto);
    const saved = await this.appointmentRepository.save(appointment);
    await this.notifyAppointment('updated', saved);
    return saved;
  }

  async remove(id: string): Promise<void> {
    const appointment = await this.findOne(id);
    await this.appointmentRepository.remove(appointment);
    await this.notifyAppointment('deleted', appointment);
  }

  private async notifyAppointment(
    action: 'created' | 'updated' | 'deleted',
    appointment: Appointment,
  ) {
    const message = `Your appointment on ${appointment.date} at ${appointment.time} was ${action}.`;
    if (appointment.customerEmail) {
      await this.notificationService.sendEmail(
        appointment.customerEmail,
        `Appointment ${action}`,
        message,
      );
    }
    if (appointment.customerPhone) {
      await this.notificationService.sendSms(
        appointment.customerPhone,
        message,
      );
    }
  }
}
