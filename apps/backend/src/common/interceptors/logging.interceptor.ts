import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  Logger,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { Request, Response } from 'express';

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  private readonly logger = new Logger('HTTP');

  intercept(context: ExecutionContext, next: CallHandler): Observable<unknown> {
    const request = context.switchToHttp().getRequest<Request>();
    const { method, url, query, params } = request;
    const body: unknown = request.body;
    const userAgent = request.get('user-agent') || '';
    const ip = request.ip || 'unknown';

    const now = Date.now();

    // Log request
    this.logger.log(
      `📥 ${method} ${url} - IP: ${ip} - User-Agent: ${userAgent}`,
    );

    if (Object.keys(query).length > 0) {
      this.logger.debug(`Query: ${JSON.stringify(query)}`);
    }

    if (Object.keys(params).length > 0) {
      this.logger.debug(`Params: ${JSON.stringify(params)}`);
    }

    if (body && typeof body === 'object' && body !== null) {
      // Don't log sensitive data like passwords
      const sanitizedBody: Record<string, unknown> = { ...body } as Record<
        string,
        unknown
      >;
      if ('password' in sanitizedBody) {
        sanitizedBody.password = '***';
      }
      if ('passwordHash' in sanitizedBody) {
        sanitizedBody.passwordHash = '***';
      }
      this.logger.debug(`Body: ${JSON.stringify(sanitizedBody)}`);
    }

    return next.handle().pipe(
      tap({
        next: () => {
          const response = context.switchToHttp().getResponse<Response>();
          const { statusCode } = response;
          const duration = Date.now() - now;

          this.logger.log(
            `📤 ${method} ${url} - ${statusCode} - ${duration}ms`,
          );
        },
        error: (error: Error & { status?: number }) => {
          const duration = Date.now() - now;
          this.logger.error(
            `❌ ${method} ${url} - ${error.status || 500} - ${duration}ms - ${error.message}`,
          );
        },
      }),
    );
  }
}
