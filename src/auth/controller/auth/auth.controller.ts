import { Body, Controller, Inject, UsePipes, ValidationPipe } from '@nestjs/common';
import { ClientProxy, MessagePattern } from '@nestjs/microservices';
import { CreateUserDto, resetPasswordDto, SendOtpDto, SignInUserDto, VarifyOtpDto } from 'src/auth/dtos/CreateUser.dto';
import { AuthService } from 'src/auth/service/auth/auth.service';
import { successResponse } from 'src/common/helperFunctions/response.helper';

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
        if(createUser) { await this.userService.sendOtp(createUser)}
        return successResponse({
            status: 200,
            message: "User Created Succeed",
            data: {}
        });
    }
    @MessagePattern({ cmd: 'varifySignUpUser' })
    async varifyUserEmail(@Body() userEmailData: VarifyOtpDto) {
        const result = await this.userService.varifySignupOtp(userEmailData);
        return successResponse({
            status: 200,
            message: "User email varified Succeed",
            data: result
        });
    }
    @MessagePattern({ cmd: 'signInUser' })
    async signInUser(@Body() signInUserData: SignInUserDto) {
        const user = await this.userService.signIn(signInUserData)
        return successResponse({
            status: 200,
            message: "JWT token Created Succeed",
            data: user
        });
    }
    @MessagePattern({ cmd: 'sendOtp' })
    async sendOtp(@Body() otpData: SendOtpDto) {
        const otp = await this.userService.sendOtp(otpData)
        return successResponse({
            status: 200,
            message: "OTP send Succeed",
            data: {}
        });

    }
    @MessagePattern({ cmd: 'varifyOtp' })
    async varifyOtp(@Body() varifyOtpData: VarifyOtpDto) {
        const otp = await this.userService.varifyOtp(varifyOtpData)
        return successResponse({
            status: 200,
            message: "OTP varified Succeed",
            data: otp
        });
    }
    @MessagePattern({ cmd: 'resetPassword' })
    async resetPassword(@Body() resetPasswordData: resetPasswordDto) {
        const resetPassword = this.userService.resetPassword(resetPasswordData);
        return successResponse({
            status: 200,
            message: "Password updated Succeed",
            data: {}
        });
    }
}
