import { Test, TestingModule } from '@nestjs/testing';
import { SalonsController } from './salons.controller';
import { SalonsService } from './salons.service';
import { CalendarService } from './calendar.service';
import { AnalyticsService } from '../analytics/analytics.service';

describe('SalonsController', () => {
  let controller: SalonsController;
  const mockSalonsService = {
    findAvailability: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [SalonsController],
      providers: [
        { provide: SalonsService, useValue: mockSalonsService },
        { provide: CalendarService, useValue: {} },
        { provide: AnalyticsService, useValue: {} },
      ],
    }).compile();

    controller = module.get<SalonsController>(SalonsController);
  });

  it('should call SalonsService.findAvailability', async () => {
    mockSalonsService.findAvailability.mockResolvedValueOnce('result');
    const result = await controller.findAvailability('1');
    expect(result).toBe('result');
    expect(mockSalonsService.findAvailability).toHaveBeenCalledWith('1');
  });
});
