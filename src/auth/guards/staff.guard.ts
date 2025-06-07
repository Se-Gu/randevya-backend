import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { UserRole } from '../../shared/enums/user-role.enum';

@Injectable()
export class StaffGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();
    const user = request.user;
    if (!user || user.role !== UserRole.STAFF) {
      return false;
    }
    const salonId = request.params.salonId || request.body?.salonId;
    if (salonId && user.salonId && salonId !== user.salonId) {
      return false;
    }
    const staffId = request.params.staffId;
    if (staffId && staffId !== user.id) {
      return false;
    }
    return true;
  }
}
