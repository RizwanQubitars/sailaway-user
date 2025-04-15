import { Module } from '@nestjs/common';
import { AuthController } from './controller/auth/auth.controller';
import { AuthService } from './service/auth/auth.service';
import { NatsClientModule } from 'src/nats-client/nats-client.module';
import { MongooseModule } from '@nestjs/mongoose';
import { User, userSchema } from 'src/schemas/User.schema';
import { JwtModule } from '@nestjs/jwt';
import { MailService } from 'src/lib/config/mail.config';
import { Otp, otpSchema } from 'src/schemas/Otp.schema';

@Module({
  imports: [
    NatsClientModule,
    MongooseModule.forFeature([
      {
        name: User.name,
        schema: userSchema,
      },
      {
        name: Otp.name,
        schema: otpSchema,
      },
  ]),
  JwtModule.register({
    secret: 'iamsecure123jwt@',   // should be in .env
    signOptions: { expiresIn: '1h' }, // or whatever you need
  }),
  ],
  controllers: [AuthController],
  providers: [AuthService, MailService],
  exports: [MailService]
})
export class AuthModule {}
