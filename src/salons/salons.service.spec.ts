import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { SalonsService } from './salons.service';
import { Salon } from './entities/salon.entity';
import { Service } from '../services/entities/service.entity';
import { NotFoundException } from '@nestjs/common';

describe('SalonsService', () => {
  let service: SalonsService;
  let salonRepository: Repository<Salon>;
  let servicesRepository: Repository<Service>;

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
      ],
    }).compile();

    service = module.get<SalonsService>(SalonsService);
    salonRepository = module.get<Repository<Salon>>(getRepositoryToken(Salon));
    servicesRepository = module.get<Repository<Service>>(
      getRepositoryToken(Service),
    );
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
});
