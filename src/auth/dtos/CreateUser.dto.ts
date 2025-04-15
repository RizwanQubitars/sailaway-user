import { IsEmail, IsNotEmpty, IsOptional } from "class-validator";

export class CreateUserDto {

    @IsNotEmpty()
    firstName: string;

    @IsNotEmpty()
    lastName: string;

    @IsNotEmpty()
    email: string;

    @IsNotEmpty()
    password: string;
}
export class SignInUserDto {

    @IsNotEmpty()
    email: string;

    @IsNotEmpty()
    password: string;
}
export class SendOtpDto {

    @IsNotEmpty()
    email: string;

}
export class VarifyOtpDto {

    @IsNotEmpty()
    email: string;

    @IsNotEmpty()
    otp: number;

}
export class resetPasswordDto {

    @IsNotEmpty()
    email: string;
    
    @IsNotEmpty()
    password: string;

}