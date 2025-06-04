import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import databaseConfig from './config/database.config';
// TODO: Create and implement these modules
// import { UsersModule } from './users/users.module';
// import { SalonsModule } from './salons/salons.module';
// import { ServicesModule } from './services/services.module';
// import { StaffModule } from './staff/staff.module';
// import { AppointmentsModule } from './appointments/appointments.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [databaseConfig],
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => {
        const config = configService.get('database');
        return config;
      },
      inject: [ConfigService],
    }),
    // UsersModule,
    // SalonsModule,
    // ServicesModule,
    // StaffModule,
    // AppointmentsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
