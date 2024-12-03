import { ValidationError } from '@nestjs/common';
import { omit } from 'lodash';
import { getErrorCodeByConstraintName } from '../validation-error-codes';
import { ErrorMessageContext } from './interfaces';

export const createErrorDetails = (context: ErrorMessageContext, value: any) => {
  return {
    value: value ?? null,
    ...omit(context, ['errorCode', 'enum', 'fieldName']),
  };
};

export function ensureErrorContextsInitialized(error: ValidationError) {
  error.contexts = error.contexts || {};
  error.contexts = initializeContexts(error, '');
}

function initializeContexts(error: ValidationError, properties: string) {
  if (isNaN(Number(error.property))) {
    properties += properties.length ? '.' + error.property : error.property;
  } else {
    properties += `[${error.property}]`;
  }
  let contexts = error.contexts || {};
  if (error.constraints) {
    Object.keys(error.constraints).forEach((constraintName) => {
      contexts[constraintName] = {
        errorCode: getErrorCodeByConstraintName(constraintName),
        fieldName: properties,
        ...contexts[constraintName],
      };
    });
  }
  if (error.children) {
    error.children.forEach((err) => {
      const newContexts = initializeContexts(err, properties);
      contexts = { ...contexts, ...newContexts };
    });
  }
  return contexts;
}
