import { ConflictException, HttpException, HttpStatus, Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from 'src/schemas/User.schema';
import { v4 as uuid } from 'uuid';
import * as bcrypt from 'bcryptjs'
import * as _ from 'lodash';
import { JwtService } from '@nestjs/jwt';
import { CreateUserType } from 'src/utils/types';
import { RpcException } from '@nestjs/microservices';
import { resetPasswordDto, SendOtpDto, SignInUserDto, VarifyOtpDto } from 'src/auth/dtos/CreateUser.dto';
import { MailService } from 'src/lib/config/mail.config';
import { Otp } from 'src/schemas/Otp.schema';


@Injectable()
export class AuthService {
    constructor(
        @InjectModel(User.name) private userModel: Model<User>,
        @InjectModel(Otp.name) private otpModel: Model<Otp>,
        private jwtService: JwtService,
        private mailService: MailService
    ) { }

    async createUser(userData: CreateUserType) {
        const user = await this.userModel.findOne({ email: userData.email });

        if (user) { throw new RpcException(new ConflictException('User already exists')) }

        const newUser = new this.userModel(
            {
                userID: `user-${uuid()}`,
                firstName: userData.firstName,
                lastName: userData.lastName,
                email: userData.email,
                password: await bcrypt.hash(userData.password, 10)
            }
        );
        return newUser.save();
    }

    async signIn(signInDto: SignInUserDto) {
        const user = await this.userModel.findOne({ email: signInDto.email });
        if (!user) { throw new RpcException(new ConflictException('Invalid Email')) }

        const varifyPassword = await bcrypt.compare(signInDto.password, user.password)
        if (!varifyPassword) { throw new RpcException(new ConflictException('Invalid Password')) }

        // Generate JWT access token
        const payload = { email: user.email, id: user.userID };
        const accessToken = await this.jwtService.signAsync(payload);
        return accessToken;
    }
    async sendOtp(otpDto: SendOtpDto) {
        const user = await this.userModel.findOne({ email: otpDto.email });
        const otpNo = Math.floor(1000 + Math.random() * 9000);

        await this.mailService.sendMail(
            otpDto.email,
            "OTP Varification",
            "text",
            `<h1>Verify your OTP</h1><br>,
            <p>Your OTP is ${otpNo}. Please use it to verify your email.</p>`
        );

        const currentDateTime = new Date();  // current date and time
        const expirationTime = new Date(currentDateTime.getTime() + 2 * 60000);

        const otp = new this.otpModel(
            {
                otpID: `otp-${uuid()}`,
                email: otpDto.email,
                otp: otpNo,
                expireIn: expirationTime
            }
        );
        return otp.save();

    }
    async varifyOtp(otpDto: VarifyOtpDto) {
        const otp = await this.otpModel.findOne({ email: otpDto.email });
        if (!otp) { throw new RpcException(new ConflictException('Invalid Otp')) }
        if (otp.expireIn < new Date()) { throw new RpcException(new ConflictException('Invalid is expired')) }

        let matchotp = false;
        if(otpDto.otp === otp.otp) matchotp = true
        return matchotp;

    }

    async resetPassword(resetPassword: resetPasswordDto) {
        const password = await bcrypt.hash(resetPassword.password, 10)
        const updatePassword = await this.userModel.updateOne(
            { email: resetPassword.email },
            { $set: { password: password } }
          );
      
        return updatePassword;

    }
}
