import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Salon } from './entities/salon.entity';
import { CreateSalonDto } from './dto/create-salon.dto';
import { UpdateSalonDto } from './dto/update-salon.dto';
import { Service } from '../services/entities/service.entity';
import { StaffService } from '../staff/staff.service';

@Injectable()
export class SalonsService {
  constructor(
    @InjectRepository(Salon)
    private readonly salonRepository: Repository<Salon>,
    @InjectRepository(Service)
    private readonly servicesRepository: Repository<Service>,
    private readonly staffService: StaffService,
  ) {}

  async create(createSalonDto: CreateSalonDto): Promise<Salon> {
    const salon = this.salonRepository.create(createSalonDto);
    return await this.salonRepository.save(salon);
  }

  async findAll(): Promise<Salon[]> {
    return await this.salonRepository.find();
  }

  async findOne(id: string): Promise<Salon> {
    const salon = await this.salonRepository.findOne({ where: { id } });
    if (!salon) {
      throw new NotFoundException(`Salon with ID ${id} not found`);
    }
    return salon;
  }

  async findServices(id: string): Promise<Service[]> {
    const salon = await this.findOne(id);
    return await this.servicesRepository.find({
      where: { salonId: salon.id },
    });
  }

  async findAvailability(id: string): Promise<any> {
    const salon = await this.findOne(id);
    return {
      weeklyAvailability: salon.weeklyAvailability,
      staffAvailability: await this.getStaffAvailability(salon.id),
    };
  }

  private async getStaffAvailability(salonId: string): Promise<any[]> {
    const staffMembers = await this.staffService.findBySalon(salonId);
    return staffMembers.map((s) => ({
      staffId: s.id,
      name: s.name,
      workingHours: s.workingHours,
    }));
  }

  async update(id: string, updateSalonDto: UpdateSalonDto): Promise<Salon> {
    const salon = await this.findOne(id);
    Object.assign(salon, updateSalonDto);
    return await this.salonRepository.save(salon);
  }

  async remove(id: string): Promise<void> {
    const salon = await this.findOne(id);
    await this.salonRepository.remove(salon);
  }
}
