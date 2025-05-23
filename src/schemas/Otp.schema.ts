import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";

@Schema({ timestamps: true })
export class Otp {

    @Prop({unique: true, required: true})
    otpID: string

    @Prop({required: true})
    email: string

    @Prop({required: true})
    otp: number

    @Prop({required: true, expires: 0})
    expireIn: Date
}

export const otpSchema = SchemaFactory.createForClass(Otp);