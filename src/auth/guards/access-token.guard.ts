import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';
import { AppointmentsService } from '../../appointments/appointments.service';

@Injectable()
export class AccessTokenGuard implements CanActivate {
  constructor(private appointmentsService: AppointmentsService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const appointmentId = request.params.id;
    const accessToken = request.query.token;

    if (!accessToken) {
      throw new UnauthorizedException('Access token is required');
    }

    const appointment = await this.appointmentsService.findOne(appointmentId);
    if (!appointment || appointment.accessToken !== accessToken) {
      throw new UnauthorizedException('Invalid access token');
    }

    // Attach the appointment to the request for use in the controller
    request.appointment = appointment;
    return true;
  }
}
