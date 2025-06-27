import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { StaffService } from '../../staff/staff.service';
import { UserRole } from '../../shared/enums/user-role.enum';

@Injectable()
export class StaffCalendarGuard implements CanActivate {
  constructor(private readonly staffService: StaffService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const user = request.user;
    const staffId = request.params.id;

    if (!user) {
      return false;
    }

    const staff = await this.staffService.findOne(staffId);

    if (user.role === UserRole.OWNER && user.salonId === staff.salonId) {
      return true;
    }

    if (user.role === UserRole.STAFF && user.id === staff.userId) {
      return true;
    }

    return false;
  }
}
