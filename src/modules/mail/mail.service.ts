import { HttpCode, HttpException, HttpStatus, Injectable, InternalServerErrorException } from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer';
import { config } from 'dotenv';
config();
@Injectable()
export class MailService {
  constructor(private readonly mailerService: MailerService) { }

  async verifyEmail(toEmail: string, verificationCode: number): Promise<any> {
    const content: EmailContent = {
      to: toEmail,
      subject: 'Verify your email',
      html: 'Please click the link below to verify your registration:<br>'
        + '<h3><a href="http://localhost:3000/auth/verify-email/' + verificationCode + '/' + toEmail + '" target="_self">VERIFY</a></h3>'
    }
    return await this.sendEmail(content)
  }

  async resetPasswordEmail(toEmail: string, securityCode: number): Promise<any> {
    const content: EmailContent = {
      to: toEmail,
      subject: 'Reset your password',
      html: 'We have received your request to reset your Facebook password. Your security code to reset password is : '
        + '<h2>'+securityCode+'<h2/>'
    }
    return await this.sendEmail(content)
  }

  async sendEmail(content: EmailContent) {
    try {
      const result = await this.mailerService.sendMail({
        to: content.to,
        from: process.env.MAIL_FROM,
        subject: content.subject,
        html: content.html
      })
      return { message: 'Check email', ...result }
    } catch (error) {
      throw new InternalServerErrorException('Can not send email')
    }
  }

}
interface EmailContent {
  to: string
  subject: string
  html: string
}