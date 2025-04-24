import { Controller, Inject, UseGuards } from '@nestjs/common';
import { ClientProxy, MessagePattern } from '@nestjs/microservices';
import { AuthenticationGuard } from 'src/common/authentication/authentication.guard';
import { successResponse } from 'src/common/helperFunctions/response.helper';
import { UserService } from 'src/user/service/user/user.service';

@Controller('user')
export class UserController {

    constructor(
            @Inject('NATS_SERVICE') private natsClient: ClientProxy,
            private userService: UserService,
        ) { }

    @MessagePattern({ cmd: 'getUserProfile'})
    async getUserProfile( ){
        const result = await this.userService.fetchUserProfile();
        return successResponse({
            status: 200,
            message: "Get user profile succeed!",
            data: result
        })
    }
}
