import { DataSource } from 'typeorm';
import { createSystemAdmin } from './seeds/create-system-admin.seed';
import { createSampleData } from './seeds/create-sample-data.seed';
import 'dotenv/config';

const dataSource = new DataSource({
  type: 'postgres',
  host: process.env.DB_HOST,
  port: parseInt(process.env.DB_PORT || '5432', 10),
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE,
  entities: ['src/**/*.entity.ts'],
  synchronize: false,
});

async function runSeed() {
  try {
    await dataSource.initialize();
    console.log('Database connection established');

    await createSystemAdmin(dataSource);
    await createSampleData(dataSource);

    console.log('Seed completed successfully');
  } catch (error) {
    console.error('Error during seed:', error);
  } finally {
    await dataSource.destroy();
  }
}

runSeed();
