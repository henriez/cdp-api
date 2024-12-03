import { ValidationError } from 'class-validator';
import { ErrorCode, getErrorCodeByConstraintName } from '../validation-error-codes';
import { createErrorDetails, ensureErrorContextsInitialized } from './errorContext';
import { createErrorMessage } from './errorMessageFactories';
import { ErrorMessageContext, FormattedError } from './interfaces';

export const formatValidationError = (error: ValidationError) => {
  ensureErrorContextsInitialized(error);
  return Object.entries(error.contexts).map(([constraintName, context]) => {
    if (error.contexts[constraintName].enum) {
      error.contexts[constraintName].enumValues = Object.values(error.contexts[constraintName].enum);
    }

    const fieldName = context?.fieldName;
    const errorCode: ErrorCode = context?.errorCode ?? getErrorCodeByConstraintName(constraintName);
    const errorMessageContext: ErrorMessageContext = {
      ...context,
      errorCode,
    } as ErrorMessageContext;
    const details = createErrorDetails(errorMessageContext, getValueByPath(error.target, fieldName));

    return {
      field: fieldName,
      reason: createErrorMessage(errorMessageContext, fieldName) || error.constraints[constraintName],
      error_code: errorCode,
      details,
    };
  });
};

function getValueByPath(obj: any, path: string): any {
  const parts = path.split('.');

  let current = obj;
  for (const part of parts) {
    const index = part.match(/^(\w+)\[(\d+)\]$/);
    if (index) {
      current = current[index[1]][+index[2]];
    } else {
      current = current[part];
    }
    if (!current) {
      return undefined; // Handle case where property doesn't exist
    }
  }
  return current;
}

export const formatValidationErrors = (errors: ValidationError[]): FormattedError[] => {
  const formattedErrors: FormattedError[] = [];

  errors.forEach((error: ValidationError) => {
    const formattedContexts = formatValidationError(error);
    formattedErrors.push(...formattedContexts);
  });

  return formattedErrors;
};
