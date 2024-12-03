import { ErrorCode } from '../../errors/validation-error-codes';

export interface FormattedError {
  field: string;
  reason: string;
  error_code: string;
  details: object;
}

export interface ErrorMessageContext {
  fieldName: string;
  errorCode?: ErrorCode;
  dateFormat?: string;
  enumValues?: string[];
  minLength?: number;
  maxLength?: number;
  minValue?: number;
  maxValue?: number;
  entity: string;
}
