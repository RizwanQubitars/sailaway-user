import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";

@Schema()
export class User {

    @Prop({unique: true, required: true})
    userID: string

    @Prop({required: true})
    firstName: string

    @Prop({required: true})
    lastName: string

    @Prop({required: true})
    email: string

    @Prop({required: true})
    password: string
}

export const userSchema = SchemaFactory.createForClass(User);