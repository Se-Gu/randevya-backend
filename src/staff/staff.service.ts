import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Between, Repository } from 'typeorm';
import { Staff } from './entities/staff.entity';
import { CreateStaffDto } from './dto/create-staff.dto';
import { UpdateStaffDto } from './dto/update-staff.dto';
import { Appointment } from '../appointments/entities/appointment.entity';

@Injectable()
export class StaffService {
  constructor(
    @InjectRepository(Staff)
    private readonly staffRepository: Repository<Staff>,
    @InjectRepository(Appointment)
    private readonly appointmentRepository: Repository<Appointment>,
  ) {}

  async create(createStaffDto: CreateStaffDto): Promise<Staff> {
    const staff = this.staffRepository.create(createStaffDto);
    return await this.staffRepository.save(staff);
  }

  async findAll(): Promise<Staff[]> {
    return await this.staffRepository.find();
  }

  async findOne(id: string): Promise<Staff> {
    const staff = await this.staffRepository.findOne({ where: { id } });
    if (!staff) {
      throw new NotFoundException(`Staff member with ID ${id} not found`);
    }
    return staff;
  }

  async findBySalon(salonId: string): Promise<Staff[]> {
    return await this.staffRepository.find({
      where: { salonId },
    });
  }

  async update(id: string, updateStaffDto: UpdateStaffDto): Promise<Staff> {
    const staff = await this.findOne(id);
    Object.assign(staff, updateStaffDto);
    return await this.staffRepository.save(staff);
  }

  async remove(id: string): Promise<void> {
    const staff = await this.findOne(id);
    await this.staffRepository.remove(staff);
  }

  private formatDate(date: Date): string {
    return date.toISOString().split('T')[0];
  }

  async getBookedSlots(
    staffId: string,
    range: 'day' | 'week' | 'month',
    dateStr: string,
  ) {
    await this.findOne(staffId);

    const date = new Date(dateStr);
    if (isNaN(date.getTime())) {
      throw new BadRequestException('Invalid date');
    }

    let start = new Date(date);
    let end = new Date(date);

    if (range === 'week') {
      const day = (start.getUTCDay() + 6) % 7; // Monday=0
      start.setUTCDate(start.getUTCDate() - day);
      end = new Date(start);
      end.setUTCDate(start.getUTCDate() + 6);
    } else if (range === 'month') {
      start = new Date(Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), 1));
      end = new Date(
        Date.UTC(date.getUTCFullYear(), date.getUTCMonth() + 1, 0),
      );
    }

    const startStr = this.formatDate(start);
    const endStr = this.formatDate(end);

    return this.appointmentRepository.find({
      where: { staffId, date: Between(startStr, endStr) },
      order: { date: 'ASC', time: 'ASC' },
    });
  }
}
