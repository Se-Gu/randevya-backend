import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { UserRole } from '../../shared/enums/user-role.enum';

@Injectable()
export class OwnerGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();
    const user = request.user;
    if (!user || user.role !== UserRole.OWNER) {
      return false;
    }
    const salonId = request.params.salonId || request.body?.salonId || request.params.id;
    if (salonId && user.salonId && salonId !== user.salonId) {
      return false;
    }
    return true;
  }
}
