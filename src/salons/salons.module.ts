import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SalonsService } from './salons.service';
import { SalonsController } from './salons.controller';
import { Salon } from './entities/salon.entity';
import { UsersModule } from '../users/users.module';

@Module({
  imports: [TypeOrmModule.forFeature([Salon]), UsersModule],
  controllers: [SalonsController],
  providers: [SalonsService],
  exports: [SalonsService],
})
export class SalonsModule {}
