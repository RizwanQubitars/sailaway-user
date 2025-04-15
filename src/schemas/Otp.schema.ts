import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";

@Schema()
export class Otp {

    @Prop({unique: true, required: true})
    otpID: string

    @Prop({required: true})
    email: string

    @Prop({required: true})
    otp: number

    @Prop({required: true})
    expireIn: Date
}

export const otpSchema = SchemaFactory.createForClass(Otp);