import { BadRequestException, ValidationError } from '@nestjs/common';
import { ResponseStatus } from '../../../utils/consts';
import { ErrorCode, ErrorMessage } from '../error-codes';
import { formatValidationErrors } from './errorFormatter';

export const validationErrorFactory = (errors: any) => {
  if (typeof errors === 'string') {
    return new BadRequestException({
      status: ResponseStatus.ERROR,
      error: {
        error_code: ErrorCode.INVALID_PARAMETERS,
        message: errors,
        details: {},
      },
    });
  }

  const formattedErrors = formatValidationErrors(errors as ValidationError[]);

  return new BadRequestException({
    status: ResponseStatus.ERROR,
    error: {
      error_code: ErrorCode.INVALID_PARAMETERS,
      message: ErrorMessage.INVALID_PARAMETERS(),
      details: {
        invalidParamsErrors: formattedErrors,
      },
    },
  });
};

export * from '../validation-error-codes';
export * from './errorContext';
export * from './errorFormatter';
export * from './errorMessageFactories';
export * from './interfaces';
