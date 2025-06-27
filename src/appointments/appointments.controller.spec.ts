import { Test, TestingModule } from '@nestjs/testing';
import { AppointmentsController } from './appointments.controller';
import { AppointmentsService } from './appointments.service';
import { CreateAppointmentDto } from './dto/create-appointment.dto';
import { UpdateAppointmentDto } from './dto/update-appointment.dto';

describe('AppointmentsController', () => {
  let controller: AppointmentsController;
  let service: jest.Mocked<AppointmentsService>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AppointmentsController],
      providers: [
        {
          provide: AppointmentsService,
          useValue: {
            create: jest.fn(),
            findAll: jest.fn(),
            findByAccessToken: jest.fn(),
            findOne: jest.fn(),
            update: jest.fn(),
            remove: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<AppointmentsController>(AppointmentsController);
    service = module.get(AppointmentsService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should create an appointment', async () => {
    const dto = {} as CreateAppointmentDto;
    (service.create as jest.Mock).mockResolvedValue('created');
    await expect(controller.create(dto)).resolves.toBe('created');
    expect(service.create).toHaveBeenCalledWith(dto);
  });

  it('should return all appointments', async () => {
    (service.findAll as jest.Mock).mockResolvedValue(['a']);
    await expect(controller.findAll()).resolves.toEqual(['a']);
    expect(service.findAll).toHaveBeenCalled();
  });

  it('should return appointment by access token', async () => {
    (service.findByAccessToken as jest.Mock).mockResolvedValue('app');
    await expect(controller.findByAccessToken('tok')).resolves.toBe('app');
    expect(service.findByAccessToken).toHaveBeenCalledWith('tok');
  });

  it('should return appointment by id', async () => {
    (service.findOne as jest.Mock).mockResolvedValue('app');
    await expect(controller.findOne('1')).resolves.toBe('app');
    expect(service.findOne).toHaveBeenCalledWith('1');
  });

  it('should update appointment', async () => {
    const dto = {} as UpdateAppointmentDto;
    (service.update as jest.Mock).mockResolvedValue('updated');
    await expect(controller.update('1', dto)).resolves.toBe('updated');
    expect(service.update).toHaveBeenCalledWith('1', dto);
  });

  it('should remove appointment', async () => {
    (service.remove as jest.Mock).mockResolvedValue(undefined);
    await expect(controller.remove('1', 'tok')).resolves.toBeUndefined();
    expect(service.remove).toHaveBeenCalledWith('1');
  });
});
