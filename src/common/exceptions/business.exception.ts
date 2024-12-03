import { HttpException, HttpStatus } from '@nestjs/common';
import { ErrorCode, ErrorMessage } from '../errors/error-codes';
import { ErrorCode as ValidationErrorCode } from '../errors/validation-error-codes';

interface BusinessErrorDetails {
  field?: string;
  value?: any;
}

export class BusinessException extends HttpException {
  constructor(
    public readonly errorCode: ErrorCode | ValidationErrorCode,
    status: HttpStatus,
    public readonly messageOpts?: object,
    public readonly details?: BusinessErrorDetails,
  ) {
    const message = ErrorMessage[errorCode](messageOpts);
    super(message, status);
  }
}
