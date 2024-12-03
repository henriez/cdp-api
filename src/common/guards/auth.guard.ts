import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';

@Injectable()
export class AuthGuard implements CanActivate {
  async canActivate(context: ExecutionContext) {
    try {
      // TODO: validate token/apikey
      return true;
    } catch (error) {
      return false;
    }
  }
}
