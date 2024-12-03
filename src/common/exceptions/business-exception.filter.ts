import { ExceptionFilter, Catch, ArgumentsHost } from '@nestjs/common';
import { Response } from 'express';
import { BusinessException } from '../exceptions/business.exception';
import { ResponseStatus } from '../../utils/consts';

@Catch(BusinessException)
export class BusinessExceptionFilter implements ExceptionFilter {
  catch(exception: BusinessException, host: ArgumentsHost) {
    const response = host.switchToHttp().getResponse<Response>();
    const status = exception.getStatus();

    const errorResponse = {
      status: ResponseStatus.ERROR,
      errors: [
        {
          error_code: exception.errorCode,
          message: exception.message,
          details: exception.details,
        },
      ],
    };

    response.status(status).json(errorResponse);
  }
}
