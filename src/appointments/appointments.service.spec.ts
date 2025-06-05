import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AppointmentsService } from './appointments.service';
import { Appointment } from './entities/appointment.entity';
import { NotFoundException } from '@nestjs/common';
import { AppointmentStatus } from '../shared/enums/appointment-status.enum';

describe('AppointmentsService', () => {
  let service: AppointmentsService;
  let appointmentRepository: Repository<Appointment>;

  const mockAppointment = {
    id: '1',
    customerName: 'John Doe',
    customerPhone: '+1234567890',
    customerEmail: 'john@example.com',
    date: '2024-03-20',
    time: '14:30',
    status: AppointmentStatus.PENDING,
    accessToken: 'test-token',
    salonId: 'salon-1',
    serviceId: 'service-1',
    staffId: 'staff-1',
  };

  const mockAppointmentRepository = {
    create: jest.fn().mockImplementation((dto) => dto),
    save: jest
      .fn()
      .mockImplementation((appointment) =>
        Promise.resolve({ id: '1', ...appointment }),
      ),
    findOne: jest.fn().mockImplementation(({ where: { id } }) => {
      if (id === '1') {
        return Promise.resolve(mockAppointment);
      }
      return Promise.resolve(null);
    }),
    find: jest.fn().mockResolvedValue([mockAppointment]),
    remove: jest.fn().mockResolvedValue(true),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AppointmentsService,
        {
          provide: getRepositoryToken(Appointment),
          useValue: mockAppointmentRepository,
        },
      ],
    }).compile();

    service = module.get<AppointmentsService>(AppointmentsService);
    appointmentRepository = module.get<Repository<Appointment>>(
      getRepositoryToken(Appointment),
    );
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create an appointment', async () => {
      const createAppointmentDto = {
        customerName: 'John Doe',
        customerPhone: '+1234567890',
        customerEmail: 'john@example.com',
        date: '2024-03-20',
        time: '14:30',
        salonId: 'salon-1',
        serviceId: 'service-1',
        staffId: 'staff-1',
      };

      const result = await service.create(createAppointmentDto);
      expect(result).toEqual({ id: '1', ...createAppointmentDto });
      expect(appointmentRepository.create).toHaveBeenCalledWith(
        createAppointmentDto,
      );
      expect(appointmentRepository.save).toHaveBeenCalled();
    });
  });

  describe('findOne', () => {
    it('should return an appointment if it exists', async () => {
      const result = await service.findOne('1');
      expect(result).toEqual(mockAppointment);
    });

    it('should throw NotFoundException if appointment does not exist', async () => {
      await expect(service.findOne('2')).rejects.toThrow(NotFoundException);
    });
  });

  describe('findAll', () => {
    it('should return an array of appointments', async () => {
      const result = await service.findAll();
      expect(result).toEqual([mockAppointment]);
    });
  });

  describe('findBySalon', () => {
    it('should return appointments for a specific salon', async () => {
      const result = await service.findBySalon('salon-1');
      expect(result).toEqual([mockAppointment]);
    });
  });
});
