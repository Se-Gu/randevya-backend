import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as sgMail from '@sendgrid/mail';
import { Twilio } from 'twilio';

@Injectable()
export class NotificationService {
  private readonly twilioClient?: Twilio;
  private hasSendgrid = false;
  private readonly logger = new Logger(NotificationService.name);

  constructor(private readonly configService: ConfigService) {
    const sendgridKey = this.configService.get<string>('SENDGRID_API_KEY');
    if (sendgridKey) {
      sgMail.setApiKey(sendgridKey);
      this.hasSendgrid = true;
    }
    const accountSid = this.configService.get<string>('TWILIO_ACCOUNT_SID');
    const authToken = this.configService.get<string>('TWILIO_AUTH_TOKEN');
    if (accountSid && authToken) {
      this.twilioClient = new Twilio(accountSid, authToken);
    }
  }

  async sendEmail(to: string, subject: string, text: string) {
    if (!this.hasSendgrid) {
      this.logger.warn('SendGrid API key not configured');
      return;
    }
    const from =
      this.configService.get<string>('SENDGRID_FROM_EMAIL') ||
      'no-reply@randevya.com';
    try {
      await sgMail.send({ to, from, subject, text });
    } catch (err) {
      this.logger.error('Failed to send email', err);
    }
  }

  async sendSms(to: string, body: string) {
    if (!this.twilioClient) {
      this.logger.warn('Twilio credentials not configured');
      return;
    }
    const from = this.configService.get<string>('TWILIO_PHONE_NUMBER');
    if (!from) {
      this.logger.warn('Twilio phone number not configured');
      return;
    }
    try {
      await this.twilioClient.messages.create({ to, from, body });
    } catch (err) {
      this.logger.error('Failed to send SMS', err);
    }
  }
}
