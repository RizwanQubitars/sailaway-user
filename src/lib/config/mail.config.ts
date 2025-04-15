import { Injectable } from '@nestjs/common';
import * as nodemailer from 'nodemailer';

@Injectable()
export class MailService {
  private transporter;

  constructor() {
    this.transporter = nodemailer.createTransport({
      host: 'smtp.gmail.com',  // or your SMTP provider
      port: 587,
      secure: false, // true for 465, false for other ports
      auth: {
        user: 'rizwantesting204@gmail.com', // your email
        pass: 'rlsl napy nlep xvbo', // your email password or app password
      },
      tls: {
        rejectUnauthorized: false,  // Optional: skip SSL validation (useful for dev)
      },
    });

    this.transporter.verify((error, success) => {
      if (error) {
        console.error('❌ Email server connection failed:', error);
      } else {
        console.log('✅ Email server is ready to take messages');
      }
    });
  }

  async sendMail(to: string, subject: string, text: string, html?: string) {
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to,
      subject,
      text,
      html,
    };

    return await this.transporter.sendMail(mailOptions);
  }
}
