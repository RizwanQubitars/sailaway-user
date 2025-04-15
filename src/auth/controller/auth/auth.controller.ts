import { Body, Controller, Inject, UsePipes, ValidationPipe } from '@nestjs/common';
import { ClientProxy, MessagePattern } from '@nestjs/microservices';
import { CreateUserDto, resetPasswordDto, SendOtpDto, SignInUserDto, VarifyOtpDto } from 'src/auth/dtos/CreateUser.dto';
import { AuthService } from 'src/auth/service/auth/auth.service';

@Controller('auth')
export class AuthController {
    
    constructor(
        @Inject('NATS_SERVICE') private natsClient: ClientProxy,
        private userService: AuthService,
    ) { }

    @MessagePattern({ cmd: 'signUpUser' })
    @UsePipes(new ValidationPipe())
    async createUser(@Body() userData: CreateUserDto) {
        const createUser = await this.userService.createUser(userData);
        return createUser;
    }
    @MessagePattern({ cmd: 'signInUser' })
   async signInUser(@Body() signInUserData: SignInUserDto) {
        const user = await this.userService.signIn(signInUserData)
        return user;
    }
    @MessagePattern({ cmd: 'sendOtp' })
   async sendOtp(@Body() otpData: SendOtpDto) {
        const otp = await this.userService.sendOtp(otpData)
        return otp;

    }
    @MessagePattern({ cmd: 'varifyOtp' })
   async varifyOtp(@Body() varifyOtpData: VarifyOtpDto) {
        const otp = await this.userService.varifyOtp(varifyOtpData)
        return otp;
    }
    @MessagePattern({ cmd: 'resetPassword' })
    async resetPassword(@Body() resetPasswordData: resetPasswordDto) {
        const resetPassword = this.userService.resetPassword(resetPasswordData);
        return resetPassword;
    }
}
