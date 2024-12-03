import { BadRequestException, HttpStatus, ValidationError } from '@nestjs/common';
import { ResponseStatus } from '../../../utils/consts';
import { ErrorCode, ErrorMessage } from '../error-codes';
import { BusinessException } from '../../exceptions/business.exception';
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

export function transformationErrorFactory(errors: any) {
  if (Array.isArray(errors)) {
    return validationErrorFactory(errors);
  }

  if (typeof errors !== 'string') {
    return validationErrorFactory([errors]);
  }

  // TODO: melhorar implementacao para que os erros saiam no padrao do serviço
  return new BusinessException(ErrorCode.INVALID_PARAMETERS, HttpStatus.BAD_REQUEST, {}, { value: errors });
}

export * from '../validation-error-codes';
export * from './errorContext';
export * from './errorFormatter';
export * from './errorMessageFactories';
export * from './interfaces';
