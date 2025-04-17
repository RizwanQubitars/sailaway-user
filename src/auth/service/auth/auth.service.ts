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

        if (user) { throw new RpcException(new HttpException('User already exist', HttpStatus.ALREADY_REPORTED)) }

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
        if (!user) { throw new RpcException(new HttpException('Invalid Email', HttpStatus.NOT_FOUND)) }

        const varifyPassword = await bcrypt.compare(signInDto.password, user.password)
        if (!varifyPassword) { throw new RpcException(new HttpException('Invalid Password', HttpStatus.NOT_FOUND)) }
        
        if (user.status === false) { throw new RpcException(new HttpException('Please varify your email', HttpStatus.BAD_REQUEST)) }

        // Generate JWT access token
        const payload = { email: user.email, id: user.userID };
        const accessToken = await this.jwtService.signAsync(payload);
        return accessToken;
    }

    async sendOtp(otpDto: SendOtpDto) {
        const otpNo = Math.floor(1000 + Math.random() * 9000);
      
        // Send the OTP email
        await this.mailService.sendMail(
          otpDto.email,
          "OTP Verification",
          "text",
          `<h1>Verify your OTP</h1>
           <p>Your OTP is <strong>${otpNo}</strong>. Please use it to verify your email.</p>`
        );
      
        const currentDateTime = new Date();
        const expirationTime = new Date(currentDateTime.getTime() + 2 * 60000); // 2 minutes from now
      
        // Check if an OTP record already exists for this email
        const existingOtp = await this.otpModel.findOne({ email: otpDto.email });
      
        if (existingOtp) {
          // Update existing OTP and expiry
          existingOtp.otp = otpNo;
          existingOtp.expireIn = expirationTime;
          await existingOtp.save();
          return { message: "OTP updated and sent successfully", otpID: existingOtp.otpID };
        }
      
        // Create a new OTP record
        const newOtp = new this.otpModel({
          otpID: `otp-${uuid()}`,
          email: otpDto.email,
          otp: otpNo,
          expireIn: expirationTime
        });
      
        await newOtp.save();
        return { message: "OTP created and sent successfully", otpID: newOtp.otpID };
      }

    async varifySignupOtp(otpDto: VarifyOtpDto) {
        const otp = await this.otpModel.findOne({ email: otpDto.email });
        if (!otp) { throw new RpcException(new HttpException('OTP not found', HttpStatus.NOT_FOUND)) }
        if (otp.expireIn < new Date()){ throw new RpcException(new HttpException('OTP is expired', HttpStatus.CONFLICT)) }
        let matchotp = false;
        if(otpDto.otp === otp.otp) {
            const updateUserStatus = await this.userModel.updateOne(
                { email: otpDto.email },
                { $set: { status: true } }
              );
              matchotp = true
        } 
        return matchotp;

    }
    async varifyOtp(otpDto: VarifyOtpDto) {
        const otp = await this.otpModel.findOne({ email: otpDto.email });
        if (!otp) { throw new RpcException(new HttpException('OTP not found', HttpStatus.NOT_FOUND)) }
        if (otp.expireIn < new Date()){ throw new RpcException(new HttpException('OTP is expired', HttpStatus.CONFLICT)) }
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
