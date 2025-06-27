import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AppointmentsService } from './appointments.service';
import { Appointment } from './entities/appointment.entity';
import { NotFoundException, BadRequestException } from '@nestjs/common';
import { Staff } from '../staff/entities';
import { StaffService } from '../staff/staff.service';
import { AppointmentStatus } from '../shared/enums/appointment-status.enum';

describe('AppointmentsService', () => {
  let service: AppointmentsService;
  let appointmentRepository: Repository<Appointment>;
  let staffRepository: Repository<Staff>;
  let staffService: StaffService;

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
    findOne: jest.fn().mockImplementation(({ where }) => {
      if (where.id) {
        return where.id === '1' ? Promise.resolve(mockAppointment) : Promise.resolve(null);
      }
      return Promise.resolve(null);
    }),
    find: jest.fn().mockResolvedValue([mockAppointment]),
    remove: jest.fn().mockResolvedValue(true),
  };

  const mockStaff = {
    id: 'staff-1',
    salonId: 'salon-1',
    workingHours: [
      {
        day: 'Wednesday',
        slots: [
          {
            start: '14:00',
            end: '15:00',
          },
        ],
      },
    ],
  };

  const mockStaffRepository = {
    findOne: jest.fn().mockImplementation(({ where: { id } }) => {
      if (id === 'staff-1') {
        return Promise.resolve(mockStaff);
      }
      return Promise.resolve(null);
    }),
  };

  const mockStaffService = {
    findBySalon: jest.fn(),
    getBookedSlots: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AppointmentsService,
        {
          provide: getRepositoryToken(Appointment),
          useValue: mockAppointmentRepository,
        },
        {
          provide: getRepositoryToken(Staff),
          useValue: mockStaffRepository,
        },
        {
          provide: StaffService,
          useValue: mockStaffService,
        },
      ],
    }).compile();

    service = module.get<AppointmentsService>(AppointmentsService);
  appointmentRepository = module.get<Repository<Appointment>>(
    getRepositoryToken(Appointment),
  );
  staffRepository = module.get<Repository<Staff>>(getRepositoryToken(Staff));
  staffService = module.get<StaffService>(StaffService);
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
      expect(result).toEqual({
        id: '1',
        ...createAppointmentDto,
        accessToken: expect.any(String),
      });
      expect(appointmentRepository.create).toHaveBeenCalledWith({
        ...createAppointmentDto,
        accessToken: expect.any(String),
      });
      expect(appointmentRepository.save).toHaveBeenCalled();
    });

    it('should throw NotFoundException if staff does not exist', async () => {
      const dto = {
        customerName: 'John Doe',
        customerPhone: '+1234567890',
        date: '2024-03-20',
        time: '14:30',
        salonId: 'salon-1',
        serviceId: 'service-1',
        staffId: 'missing',
      };

      await expect(service.create(dto)).rejects.toThrow(NotFoundException);
    });

    it('should throw BadRequestException if staff belongs to another salon', async () => {
      mockStaffRepository.findOne.mockResolvedValueOnce({ ...mockStaff, salonId: 'other' });

      const dto = {
        customerName: 'John Doe',
        customerPhone: '+1234567890',
        date: '2024-03-20',
        time: '14:30',
        salonId: 'salon-1',
        serviceId: 'service-1',
        staffId: 'staff-1',
      };

      await expect(service.create(dto)).rejects.toThrow(BadRequestException);
    });

    it('should throw BadRequestException if time is outside working hours', async () => {
      mockStaffRepository.findOne.mockResolvedValueOnce({
        ...mockStaff,
        workingHours: [
          {
            day: 'Wednesday',
            slots: [{ start: '10:00', end: '11:00' }],
          },
        ],
      });

      const dto = {
        customerName: 'John Doe',
        customerPhone: '+1234567890',
        date: '2024-03-20',
        time: '14:30',
        salonId: 'salon-1',
        serviceId: 'service-1',
        staffId: 'staff-1',
      };

      await expect(service.create(dto)).rejects.toThrow(BadRequestException);
    });

    it('should throw BadRequestException if appointment conflicts', async () => {
      mockAppointmentRepository.findOne.mockImplementationOnce(({ where }) => {
        if (where && where.staffId) {
          return Promise.resolve(mockAppointment);
        }
        return Promise.resolve(null);
      });

      const dto = {
        customerName: 'John Doe',
        customerPhone: '+1234567890',
        date: '2024-03-20',
        time: '14:30',
        salonId: 'salon-1',
        serviceId: 'service-1',
        staffId: 'staff-1',
      };

      await expect(service.create(dto)).rejects.toThrow(BadRequestException);
    });

    it('should assign an available staff member when none is specified', async () => {
      mockStaffService.findBySalon.mockResolvedValue([mockStaff]);
      mockStaffService.getBookedSlots.mockResolvedValue([]);

      const dto = {
        customerName: 'John Doe',
        customerPhone: '+1234567890',
        date: '2024-03-20',
        time: '14:30',
        salonId: 'salon-1',
        serviceId: 'service-1',
      } as any;

      const result = await service.create(dto);
      expect(result.staffId).toBe('staff-1');
      expect(appointmentRepository.create).toHaveBeenCalledWith({
        ...dto,
        staffId: 'staff-1',
        accessToken: expect.any(String),
      });
    });

    it('should throw BadRequestException if no staff is available', async () => {
      mockStaffService.findBySalon.mockResolvedValue([mockStaff]);
      mockStaffService.getBookedSlots.mockResolvedValue([mockAppointment]);

      const dto = {
        customerName: 'John Doe',
        customerPhone: '+1234567890',
        date: '2024-03-20',
        time: '14:30',
        salonId: 'salon-1',
        serviceId: 'service-1',
      } as any;

      await expect(service.create(dto)).rejects.toThrow(BadRequestException);
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
