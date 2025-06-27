import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Appointment } from '../appointments/entities/appointment.entity';
import { Service } from '../services/entities/service.entity';
import { Staff } from '../staff/entities/staff.entity';
import { Salon } from '../salons/entities/salon.entity';

export interface StaffMetrics {
  appointmentCount: number;
  revenue: number;
  mostBookedService: {
    serviceId: string;
    name: string;
    count: number;
  } | null;
  utilizationRate: number;
}

export interface SalonMetrics {
  appointmentCount: number;
  revenue: number;
  utilizationRate: number;
}

@Injectable()
export class AnalyticsService {
  constructor(
    @InjectRepository(Appointment)
    private readonly appointmentRepository: Repository<Appointment>,
    @InjectRepository(Service)
    private readonly serviceRepository: Repository<Service>,
    @InjectRepository(Staff)
    private readonly staffRepository: Repository<Staff>,
    @InjectRepository(Salon)
    private readonly salonRepository: Repository<Salon>,
  ) {}

  async getStaffMetrics(staffId: string): Promise<StaffMetrics> {
    const staff = await this.staffRepository.findOne({
      where: { id: staffId },
    });
    if (!staff) {
      throw new NotFoundException(`Staff member with ID ${staffId} not found`);
    }

    const baseQuery = this.appointmentRepository
      .createQueryBuilder('appointment')
      .leftJoin('appointment.service', 'service')
      .where('appointment.staffId = :staffId', { staffId });

    const appointmentCount = await baseQuery.getCount();

    const revenueResult = await baseQuery
      .select('SUM(service.price)', 'revenue')
      .getRawOne<{ revenue: string }>();
    const revenue = parseFloat(revenueResult?.revenue ?? '0');

    const mostBooked = await this.appointmentRepository
      .createQueryBuilder('appointment')
      .leftJoin('appointment.service', 'service')
      .select('appointment.serviceId', 'serviceId')
      .addSelect('service.name', 'name')
      .addSelect('COUNT(*)', 'count')
      .where('appointment.staffId = :staffId', { staffId })
      .groupBy('appointment.serviceId')
      .addGroupBy('service.name')
      .orderBy('count', 'DESC')
      .limit(1)
      .getRawOne<{ serviceId: string; name: string; count: string }>();

    const mostBookedService =
      mostBooked && mostBooked.serviceId
        ? {
            serviceId: mostBooked.serviceId,
            name: mostBooked.name,
            count: parseInt(mostBooked.count, 10),
          }
        : null;

    const durationResult = await baseQuery
      .select('SUM(service.durationMinutes)', 'duration')
      .getRawOne<{ duration: string }>();
    const bookedMinutes = parseInt(durationResult?.duration ?? '0', 10);

    const workingMinutes = staff.workingHours.reduce((dayAcc, day) => {
      return (
        dayAcc +
        day.slots.reduce((slotAcc, slot) => {
          const [sh, sm] = slot.start.split(':').map(Number);
          const [eh, em] = slot.end.split(':').map(Number);
          return slotAcc + (eh * 60 + em - (sh * 60 + sm));
        }, 0)
      );
    }, 0);

    const utilizationRate = workingMinutes ? bookedMinutes / workingMinutes : 0;

    return {
      appointmentCount,
      revenue,
      mostBookedService,
      utilizationRate,
    };
  }

  async getSalonMetrics(salonId: string): Promise<SalonMetrics> {
    const salon = await this.salonRepository.findOne({ where: { id: salonId } });
    if (!salon) {
      throw new NotFoundException(`Salon with ID ${salonId} not found`);
    }

    const baseQuery = this.appointmentRepository
      .createQueryBuilder('appointment')
      .leftJoin('appointment.service', 'service')
      .where('appointment.salonId = :salonId', { salonId });

    const appointmentCount = await baseQuery.getCount();

    const revenueResult = await baseQuery
      .select('SUM(service.price)', 'revenue')
      .getRawOne<{ revenue: string }>();
    const revenue = parseFloat(revenueResult?.revenue ?? '0');

    const durationResult = await baseQuery
      .select('SUM(service.durationMinutes)', 'duration')
      .getRawOne<{ duration: string }>();
    const bookedMinutes = parseInt(durationResult?.duration ?? '0', 10);

    const staffMembers = await this.staffRepository.find({
      where: { salonId },
    });

    const workingMinutes = staffMembers.reduce((total, staff) => {
      return (
        total +
        staff.workingHours.reduce((dayAcc, day) => {
          return (
            dayAcc +
            day.slots.reduce((slotAcc, slot) => {
              const [sh, sm] = slot.start.split(':').map(Number);
              const [eh, em] = slot.end.split(':').map(Number);
              return slotAcc + (eh * 60 + em - (sh * 60 + sm));
            }, 0)
          );
        }, 0)
      );
    }, 0);

    const utilizationRate = workingMinutes
      ? bookedMinutes / workingMinutes
      : 0;

    return { appointmentCount, revenue, utilizationRate };
  }
}
