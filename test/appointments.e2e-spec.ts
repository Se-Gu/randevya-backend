import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';

describe('Appointments and Analytics (e2e)', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  it('creates and cancels an appointment via token', async () => {
    const createDto = {
      salonId: '00000000-0000-0000-0000-000000000000',
      serviceId: '00000000-0000-0000-0000-000000000000',
      customerName: 'John',
      customerPhone: '+15555555555',
      date: '2025-01-01',
      time: '10:00',
    };

    const createRes = await request(app.getHttpServer())
      .post('/appointments')
      .send(createDto);

    const { id, accessToken } = createRes.body;
    await request(app.getHttpServer())
      .delete(`/appointments/${id}`)
      .query({ token: accessToken })
      .expect(200);
  });

  it('denies access to owner metrics without auth', () => {
    return request(app.getHttpServer())
      .get('/staff/1/metrics')
      .expect(401);
  });
});
