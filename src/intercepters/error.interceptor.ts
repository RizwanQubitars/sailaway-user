import { ArgumentsHost, Catch, ExceptionFilter, Logger } from '@nestjs/common';
import { RpcException } from '@nestjs/microservices';

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  private readonly logger = new Logger(AllExceptionsFilter.name);

  catch(exception: any, host: ArgumentsHost) {
    const ctx = host.switchToRpc();
    const data = ctx.getData();

    this.logger.error(
      `Exception thrown: ${exception.message || exception}`,
      JSON.stringify(data),
    );

    // If it's a known RpcException, return it
    if (exception instanceof RpcException) {
      return exception;
    }

    // Otherwise, wrap it into RpcException
    return new RpcException('Internal server error');
  }
}
