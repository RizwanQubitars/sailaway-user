import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from 'src/schemas/User.schema';

@Injectable()
export class UserService {
     constructor(
            @InjectModel(User.name) private userModel: Model<User>,
        ) { }

        async fetchUserProfile(){
            const userData = await this.userModel.findOne();
            return userData;
        }
}
