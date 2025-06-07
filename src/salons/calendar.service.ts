import { Injectable } from '@nestjs/common';
import { AppointmentsService } from '../appointments/appointments.service';
import { StaffService } from '../staff/staff.service';

export type CalendarView = 'day' | 'week' | 'month';

@Injectable()
export class CalendarService {
  constructor(
    private readonly appointmentsService: AppointmentsService,
    private readonly staffService: StaffService,
  ) {}

  async getSalonCalendar(salonId: string, view: CalendarView) {
    const [staffMembers, appointments] = await Promise.all([
      this.staffService.findBySalon(salonId),
      this.appointmentsService.findBySalon(salonId),
    ]);

    const now = new Date();
    let rangeStart: Date;
    let rangeEnd: Date;

    if (view === 'day') {
      rangeStart = new Date(now.getFullYear(), now.getMonth(), now.getDate());
      rangeEnd = new Date(rangeStart);
      rangeEnd.setDate(rangeEnd.getDate() + 1);
    } else if (view === 'week') {
      rangeStart = new Date(now);
      rangeStart.setDate(now.getDate() - now.getDay());
      rangeStart.setHours(0, 0, 0, 0);
      rangeEnd = new Date(rangeStart);
      rangeEnd.setDate(rangeEnd.getDate() + 7);
    } else {
      rangeStart = new Date(now.getFullYear(), now.getMonth(), 1);
      rangeEnd = new Date(
        rangeStart.getFullYear(),
        rangeStart.getMonth() + 1,
        1,
      );
    }

    const filteredAppointments = appointments.filter((a) => {
      const date = new Date(`${a.date}T${a.time}`);
      return date >= rangeStart && date < rangeEnd;
    });

    return {
      salonId,
      view,
      staffSchedules: staffMembers.map((s) => ({
        id: s.id,
        name: s.name,
        workingHours: s.workingHours,
        appointments: filteredAppointments.filter((a) => a.staffId === s.id),
      })),
    };
  }
}
