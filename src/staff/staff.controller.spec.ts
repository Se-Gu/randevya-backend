import { Test, TestingModule } from '@nestjs/testing';
import { StaffController } from './staff.controller';
import { StaffService } from './staff.service';
import { AnalyticsService } from '../analytics/analytics.service';
import { CreateStaffDto } from './dto/create-staff.dto';
import { UpdateStaffDto } from './dto/update-staff.dto';

describe('StaffController', () => {
  let controller: StaffController;
  let staffService: jest.Mocked<StaffService>;
  let analyticsService: jest.Mocked<AnalyticsService>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [StaffController],
      providers: [
        {
          provide: StaffService,
          useValue: {
            create: jest.fn(),
            findAll: jest.fn(),
            findOne: jest.fn(),
            getBookedSlots: jest.fn(),
            findBySalon: jest.fn(),
            update: jest.fn(),
            remove: jest.fn(),
          },
        },
        {
          provide: AnalyticsService,
          useValue: {
            getStaffMetrics: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<StaffController>(StaffController);
    staffService = module.get(StaffService);
    analyticsService = module.get(AnalyticsService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should create staff', async () => {
    const dto = {} as CreateStaffDto;
    (staffService.create as jest.Mock).mockResolvedValue('created');
    await expect(controller.create(dto)).resolves.toBe('created');
    expect(staffService.create).toHaveBeenCalledWith(dto);
  });

  it('should return all staff', async () => {
    (staffService.findAll as jest.Mock).mockResolvedValue(['s']);
    await expect(controller.findAll()).resolves.toEqual(['s']);
    expect(staffService.findAll).toHaveBeenCalled();
  });

  it('should return staff by id', async () => {
    (staffService.findOne as jest.Mock).mockResolvedValue('s');
    await expect(controller.findOne('1')).resolves.toBe('s');
    expect(staffService.findOne).toHaveBeenCalledWith('1');
  });

  it('should get calendar', async () => {
    (staffService.getBookedSlots as jest.Mock).mockResolvedValue(['slot']);
    await expect(controller.getCalendar('1', 'week', '2024-01-01')).resolves.toEqual(['slot']);
    expect(staffService.getBookedSlots).toHaveBeenCalledWith('1', 'week', '2024-01-01');
  });

  it('should get metrics', async () => {
    (analyticsService.getStaffMetrics as jest.Mock).mockResolvedValue({} as any);
    await expect(controller.getMetrics('1')).resolves.toEqual({});
    expect(analyticsService.getStaffMetrics).toHaveBeenCalledWith('1');
  });

  it('should find by salon', async () => {
    (staffService.findBySalon as jest.Mock).mockResolvedValue(['s']);
    await expect(controller.findBySalon('salon')).resolves.toEqual(['s']);
    expect(staffService.findBySalon).toHaveBeenCalledWith('salon');
  });

  it('should update staff', async () => {
    const dto = {} as UpdateStaffDto;
    (staffService.update as jest.Mock).mockResolvedValue('u');
    await expect(controller.update('1', dto)).resolves.toBe('u');
    expect(staffService.update).toHaveBeenCalledWith('1', dto);
  });

  it('should remove staff', async () => {
    (staffService.remove as jest.Mock).mockResolvedValue(undefined);
    await expect(controller.remove('1')).resolves.toBeUndefined();
    expect(staffService.remove).toHaveBeenCalledWith('1');
  });
});
