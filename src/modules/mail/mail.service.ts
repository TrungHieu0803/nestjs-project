import { Injectable } from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer';
import { config } from 'dotenv';
config();
@Injectable()
export class MailService {
  constructor(private readonly mailerService: MailerService) { }

  async verifyEmail(toEmail:string , verificationCode :number): Promise<any> {
    try {
      const result = await this.mailerService.sendMail({
          to: toEmail, 
          from: process.env.MAIL_FROM, 
          subject: 'Testing Nest MailerModule ✔', 
          text: 'welcome', 
          html: 'Please click the link below to verify your registration:<br>'
               +'<h3><a href="http://localhost:3000/auth/verify-email/'+verificationCode+'/'+toEmail+'" target="_self">VERIFY</a></h3>'
        })
        console.log(result)
      return {message:'Check email',...result}     
    } catch (error) {
      return {message:'Can not send email',...error}
    }
    
  }

}