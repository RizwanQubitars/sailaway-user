import { Module } from '@nestjs/common';
import { UserController } from './controller/user/user.controller';
import { UserService } from './service/user/user.service';
import { NatsClientModule } from 'src/nats-client/nats-client.module';
import { MongooseModule } from '@nestjs/mongoose';
import { User, userSchema } from 'src/schemas/User.schema';
import { AuthenticationGuard } from 'src/common/authentication/authentication.guard';
import { APP_GUARD } from '@nestjs/core';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [
       NatsClientModule,
        MongooseModule.forFeature([
          {
            name: User.name,
            schema: userSchema,
          },
      ]),
      JwtModule.register({
              secret: 'iamsecure123jwt@',   // should be in .env
              signOptions: { expiresIn: '1h' }, // or whatever you need
            }),
  ],
  controllers: [UserController],
  providers: [
    UserService,
  ]
})
export class UserModule {}
