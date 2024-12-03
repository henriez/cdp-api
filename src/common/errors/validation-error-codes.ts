export enum ErrorCode {
  ARRAY_MUST_NOT_BE_EMPTY = 'ARRAY_MUST_NOT_BE_EMPTY',
  FIELD_MAX_LENGTH_EXCEEDED = 'FIELD_MAX_LENGTH_EXCEEDED',
  FIELD_MIN_LENGTH_NOT_MET = 'FIELD_MIN_LENGTH_NOT_MET',
  FIELD_MUST_BE_INTEGER = 'FIELD_MUST_BE_INTEGER',
  FIELD_MUST_BE_BOOLEAN = 'FIELD_MUST_BE_BOOLEAN',
  FIELD_MUST_BE_EMAIL = 'FIELD_MUST_BE_EMAIL',
  FIELD_MUST_BE_NUMERIC = 'FIELD_MUST_BE_NUMERIC',
  FIELD_MUST_BE_PHONE_NUMBER = 'FIELD_MUST_BE_PHONE_NUMBER',
  FIELD_MUST_BE_STRING = 'FIELD_MUST_BE_STRING',
  FIELD_MUST_NOT_BE_EMPTY = 'FIELD_MUST_NOT_BE_EMPTY',
  INVALID_DATE_FORMAT = 'INVALID_DATE_FORMAT',
  INVALID_URL_FORMAT = 'INVALID_URL_FORMAT',
  NUMBER_MUST_BE_POSITIVE = 'NUMBER_MUST_BE_POSITIVE',
  UNSUPPORTED_ENUM_VALUE = 'UNSUPPORTED_ENUM_VALUE',
  VALUE_BELOW_MINIMUM = 'VALUE_BELOW_MINIMUM',
  VALUE_ABOVE_MAXIMUM = 'VALUE_ABOVE_MAXIMUM',
  FIELD_MUST_BE_ARRAY = 'FIELD_MUST_BE_ARRAY',
  FIELD_MUST_BE_UUID = 'FIELD_MUST_BE_UUID',
  FIELD_MUST_BE_DEFINED = 'FIELD_MUST_BE_DEFINED',
}

/**
 *
 * @param constraintName
 * @returns the error code for the given constraint or null if this constraint is not registered
 */
export const getErrorCodeByConstraintName = function (constraintName: string): ErrorCode {
  switch (constraintName) {
    case 'arrayNotEmpty':
      return ErrorCode.ARRAY_MUST_NOT_BE_EMPTY;
    case 'maxLength':
      return ErrorCode.FIELD_MAX_LENGTH_EXCEEDED;
    case 'minLength':
      return ErrorCode.FIELD_MIN_LENGTH_NOT_MET;
    case 'isBoolean':
      return ErrorCode.FIELD_MUST_BE_BOOLEAN;
    case 'isEmail':
      return ErrorCode.FIELD_MUST_BE_EMAIL;
    case 'isNumber':
      return ErrorCode.FIELD_MUST_BE_NUMERIC;
    case 'isInt':
      return ErrorCode.FIELD_MUST_BE_INTEGER;
    case 'isPhoneNumber':
      return ErrorCode.FIELD_MUST_BE_PHONE_NUMBER;
    case 'isString':
      return ErrorCode.FIELD_MUST_BE_STRING;
    case 'isNotEmpty':
      return ErrorCode.FIELD_MUST_NOT_BE_EMPTY;
    case 'isPositive':
      return ErrorCode.NUMBER_MUST_BE_POSITIVE;
    case 'min':
      return ErrorCode.VALUE_BELOW_MINIMUM;
    case 'max':
      return ErrorCode.VALUE_ABOVE_MAXIMUM;
    case 'isEnum':
      return ErrorCode.UNSUPPORTED_ENUM_VALUE;
    case 'isDate':
    case 'DateFormatConstraint':
      return ErrorCode.INVALID_DATE_FORMAT;
    case 'isUrl':
      return ErrorCode.INVALID_URL_FORMAT;
    case 'isArray':
      return ErrorCode.FIELD_MUST_BE_ARRAY;
    case 'isUuid':
      return ErrorCode.FIELD_MUST_BE_UUID;
    case 'isDefined':
      return ErrorCode.FIELD_MUST_BE_DEFINED;
    case 'isRFC3339':
      return ErrorCode.INVALID_DATE_FORMAT;
    default:
      return null;
  }
};
