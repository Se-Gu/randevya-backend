import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { SalonsService } from './salons.service';
import { Salon } from './entities/salon.entity';
import { Service } from '../services/entities/service.entity';
import { NotFoundException } from '@nestjs/common';
import { StaffService } from '../staff/staff.service';

describe('SalonsService', () => {
  let service: SalonsService;
  let salonRepository: Repository<Salon>;
  let servicesRepository: Repository<Service>;
  let staffService: StaffService;

  const mockSalon = {
    id: '1',
    name: 'Test Salon',
    phone: '+1234567890',
    email: 'test@salon.com',
    location: {
      address: '123 Test St',
      lat: 0,
      lng: 0,
    },
    weeklyAvailability: [],
  };

  const mockSalonRepository = {
    create: jest.fn().mockImplementation((dto) => dto),
    save: jest
      .fn()
      .mockImplementation((salon) => Promise.resolve({ id: '1', ...salon })),
    findOne: jest.fn().mockImplementation(({ where: { id } }) => {
      if (id === '1') {
        return Promise.resolve(mockSalon);
      }
      return Promise.resolve(null);
    }),
    find: jest.fn().mockResolvedValue([mockSalon]),
    remove: jest.fn().mockResolvedValue(true),
  };

  const mockServicesRepository = {
    find: jest.fn().mockResolvedValue([]),
  };

  const mockStaffService = {
    findBySalon: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        SalonsService,
        {
          provide: getRepositoryToken(Salon),
          useValue: mockSalonRepository,
        },
        {
          provide: getRepositoryToken(Service),
          useValue: mockServicesRepository,
        },
        {
          provide: StaffService,
          useValue: mockStaffService,
        },
      ],
    }).compile();

    service = module.get<SalonsService>(SalonsService);
    salonRepository = module.get<Repository<Salon>>(getRepositoryToken(Salon));
    servicesRepository = module.get<Repository<Service>>(getRepositoryToken(Service));
    staffService = module.get<StaffService>(StaffService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create a salon', async () => {
      const createSalonDto = {
        name: 'Test Salon',
        phone: '+1234567890',
        email: 'test@salon.com',
        location: {
          address: '123 Test St',
          lat: 0,
          lng: 0,
        },
      };

      const result = await service.create(createSalonDto);
      expect(result).toEqual({ id: '1', ...createSalonDto });
      expect(salonRepository.create).toHaveBeenCalledWith(createSalonDto);
      expect(salonRepository.save).toHaveBeenCalled();
    });
  });

  describe('findOne', () => {
    it('should return a salon if it exists', async () => {
      const result = await service.findOne('1');
      expect(result).toEqual(mockSalon);
    });

    it('should throw NotFoundException if salon does not exist', async () => {
      await expect(service.findOne('2')).rejects.toThrow(NotFoundException);
    });
  });

  describe('findAll', () => {
    it('should return an array of salons', async () => {
      const result = await service.findAll();
      expect(result).toEqual([mockSalon]);
    });
  });

  describe('findAvailability', () => {
    it('should return salon availability with staff hours', async () => {
      const staff = [
        { id: 'staff1', name: 'Alice', workingHours: [] },
      ];
      mockStaffService.findBySalon.mockResolvedValueOnce(staff);

      const result = await service.findAvailability('1');

      expect(mockStaffService.findBySalon).toHaveBeenCalledWith('1');
      expect(result).toEqual({
        weeklyAvailability: mockSalon.weeklyAvailability,
        staffAvailability: [
          { staffId: 'staff1', name: 'Alice', workingHours: [] },
        ],
      });
    });
  });

  describe('getStaffAvailability (private)', () => {
    it('should map staff to availability objects', async () => {
      const staff = [
        { id: 's1', name: 'Bob', workingHours: [{ day: 'Monday', slots: [] }] },
      ];
      mockStaffService.findBySalon.mockResolvedValueOnce(staff);

      const result = await (service as any).getStaffAvailability('1');

      expect(result).toEqual([
        { staffId: 's1', name: 'Bob', workingHours: staff[0].workingHours },
      ]);
    });
  });
});
