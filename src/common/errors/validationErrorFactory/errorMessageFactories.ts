import { ErrorCode } from '../../errors/validation-error-codes';
import { ErrorMessageContext } from './interfaces';

export const ERROR_MESSAGE_FACTORIES = {
  [ErrorCode.ARRAY_MUST_NOT_BE_EMPTY]: ({ fieldName }: ErrorMessageContext) =>
    `'${fieldName}' must not be an empty array`,

  [ErrorCode.FIELD_MAX_LENGTH_EXCEEDED]: ({ fieldName, maxLength }: ErrorMessageContext) =>
    `Field '${fieldName}' must have at most ${maxLength} characters`,

  [ErrorCode.FIELD_MIN_LENGTH_NOT_MET]: ({ fieldName, minLength }: ErrorMessageContext) =>
    `Field '${fieldName}' must have at least ${minLength} characters`,

  [ErrorCode.FIELD_MUST_BE_BOOLEAN]: ({ fieldName }: ErrorMessageContext) => `Field '${fieldName}' must be a boolean`,

  [ErrorCode.FIELD_MUST_BE_EMAIL]: ({ fieldName }: ErrorMessageContext) => `Field '${fieldName}' must be a valid email`,

  [ErrorCode.FIELD_MUST_BE_INTEGER]: ({ fieldName }: ErrorMessageContext) => `Field '${fieldName}' must be an integer`,

  [ErrorCode.FIELD_MUST_BE_NUMERIC]: ({ fieldName }: ErrorMessageContext) => `Field '${fieldName}' must be a number`,

  [ErrorCode.FIELD_MUST_BE_PHONE_NUMBER]: ({ fieldName }: ErrorMessageContext) =>
    `Field '${fieldName}' must be a valid phone number`,

  [ErrorCode.FIELD_MUST_BE_STRING]: ({ fieldName }: ErrorMessageContext) => `Field '${fieldName}' must be a string`,

  [ErrorCode.FIELD_MUST_NOT_BE_EMPTY]: ({ fieldName }: ErrorMessageContext) => `Field '${fieldName}' must not be empty`,

  [ErrorCode.INVALID_DATE_FORMAT]: ({ fieldName, dateFormat }: ErrorMessageContext) =>
    `Field '${fieldName}' must be a valid date string in the format '${dateFormat}'`,

  [ErrorCode.INVALID_URL_FORMAT]: ({ fieldName }: ErrorMessageContext) => `Field '${fieldName}' must be a valid URL`,

  [ErrorCode.NUMBER_MUST_BE_POSITIVE]: ({ fieldName }: ErrorMessageContext) =>
    `Field '${fieldName}' must be a positive number`,

  [ErrorCode.UNSUPPORTED_ENUM_VALUE]: ({ fieldName, enumValues }: ErrorMessageContext) =>
    `Field '${fieldName}' must be one of the following enum values: ${enumValues}`,

  [ErrorCode.VALUE_ABOVE_MAXIMUM]: ({ fieldName, maxValue }: ErrorMessageContext) =>
    `Value of field '${fieldName}' is above the maximum allowed (${maxValue})`,

  [ErrorCode.VALUE_BELOW_MINIMUM]: ({ fieldName, minValue }: ErrorMessageContext) =>
    `Value of field '${fieldName}' is below the minimum allowed (${minValue})`,

  [ErrorCode.FIELD_MUST_BE_ARRAY]: ({ fieldName }: ErrorMessageContext) => `Field '${fieldName}' must be an array`,

  [ErrorCode.FIELD_MUST_BE_UUID]: ({ fieldName }: ErrorMessageContext) => `Field '${fieldName}' must be a valid UUID`,

  [ErrorCode.FIELD_MUST_BE_DEFINED]: ({ fieldName }: ErrorMessageContext) => `Field '${fieldName}' must be defined`,
};

export const createErrorMessage = (context: ErrorMessageContext, fieldName: string) => {
  const messageFactory = ERROR_MESSAGE_FACTORIES[context.errorCode];
  if (messageFactory) {
    return messageFactory({ fieldName, ...context });
  }
  return null;
};
