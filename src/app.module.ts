import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { MongooseModule } from '@nestjs/mongoose';
import { UserModule } from './user/user.module';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [
    AuthModule,
    MongooseModule.forRoot('mongodb+srv://hadeeddev:9zIctZwIRswYdrfx@cluster0.zadukmo.mongodb.net/sailaway?retryWrites=true&w=majority&appName=Cluster0'),
     JwtModule.register({
        secret: 'iamsecure123jwt@',   // should be in .env
        signOptions: { expiresIn: '1h' }, // or whatever you need
      }),
    UserModule
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
