import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';

@Injectable()
export class AuthGuard implements CanActivate {
  async canActivate(context: ExecutionContext) {
    try {
      // TODO: validate token/apikey
      if (process.env.NODE_ENV === 'dev') return true;
      const headers = context.switchToHttp().getRequest().headers;
      return process.env.CDP_API_KEY === headers['x-api-key'];
    } catch (error) {
      return false;
    }
  }
}
