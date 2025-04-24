import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { RpcException } from '@nestjs/microservices';

@Injectable()
export class AuthenticationGuard implements CanActivate {
  constructor(private readonly jwtService: JwtService) {}

  canActivate(context: ExecutionContext): boolean {
    const rpcContext = context.switchToRpc();
    const metadata = rpcContext.getContext(); // This is where NATS metadata lives
console.log(metadata)
    const token = metadata?.headers?.authorization?.split(' ')[1];
    console.log(token, '=> token');

    if (!token) {
      throw new RpcException(new UnauthorizedException('Token missing'));
    }

    try {
      const decoded = this.jwtService.verify(token, {
        secret: 'iamsecure123jwt@',
      });

      // Attach decoded user to context if needed, for downstream usage
      // NATS context isn't easily mutable, so you typically pass user details in return or via interceptors
      return true;
    } catch (err) {
      throw new RpcException(new UnauthorizedException('Invalid or expired token'));
    }
  }
}
