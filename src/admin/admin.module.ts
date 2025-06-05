import { Module } from '@nestjs/common';
import { AdminController } from './admin.controller';
import { UsersModule } from '../users/users.module';
import { SalonsModule } from '../salons/salons.module';

@Module({
  imports: [UsersModule, SalonsModule],
  controllers: [AdminController],
})
export class AdminModule {}
