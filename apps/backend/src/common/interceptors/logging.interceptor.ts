import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  Logger,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  private readonly logger = new Logger('HTTP');

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    const request = context.switchToHttp().getRequest();
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    const { method, url, body, query, params } = request;
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-call
    const userAgent = request.get('user-agent') || '';
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access
    const ip = request.ip;

    const now = Date.now();

    // Log request
    this.logger.log(
      `📥 ${method as string} ${url as string} - IP: ${ip as string} - User-Agent: ${userAgent as string}`,
    );

    // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
    if (Object.keys(query).length > 0) {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
      this.logger.debug(`Query: ${JSON.stringify(query)}`);
    }

    // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
    if (Object.keys(params).length > 0) {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
      this.logger.debug(`Params: ${JSON.stringify(params)}`);
    }

    // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
    if (body && Object.keys(body).length > 0) {
      // Don't log sensitive data like passwords
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      const sanitizedBody = { ...body };
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      if (sanitizedBody.password) {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
        sanitizedBody.password = '***';
      }
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      if (sanitizedBody.passwordHash) {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
        sanitizedBody.passwordHash = '***';
      }
      this.logger.debug(`Body: ${JSON.stringify(sanitizedBody)}`);
    }

    return next.handle().pipe(
      tap({
        next: () => {
          // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
          const response = context.switchToHttp().getResponse();
          // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
          const { statusCode } = response;
          const duration = Date.now() - now;

          this.logger.log(
            `📤 ${method as string} ${url as string} - ${statusCode as number} - ${duration}ms`,
          );
        },
        error: (error: any) => {
          const duration = Date.now() - now;
          // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
          this.logger.error(
            // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
            `❌ ${method as string} ${url as string} - ${error.status || 500} - ${duration}ms - ${error.message}`,
          );
        },
      }),
    );
  }
}
