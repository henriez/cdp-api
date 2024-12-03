import { CallHandler, ExecutionContext, NestInterceptor } from '@nestjs/common';
import { Observable, tap } from 'rxjs';

export class LogInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const dt = Date.now();
    return next.handle().pipe(
      tap(() => {
        const request = context.switchToHttp().getRequest();
        // can evolve to save logs internally or externally
        console.log(`URL: ${request.url}`);
        console.log(`Execution in: ${Date.now() - dt} milissegundos`);
      }),
    );
  }
}
