export const ErrorMessage = {
  INVALID_PARAMETERS: ({ message }: any = {}) => message || 'Invalid parameters',
  ENTITY_NOT_FOUND: ({ message, entityName, entity }: any = {}) => message || `${entityName} ${entity} not found`,
  ENTITY_ALREADY_EXISTS: ({ message, entityName }: any = {}) => message || `${entityName} already exists`,
  INVALID_HEADER: ({ header, message }) => `Invalid header ${header}${message ? `: ${message}` : ''}`,
  RESOURCE_CONFLICT: ({ message, entity }: any = {}) => message || `Resource conflict: ${entity}`,
  INTERNAL_SERVER_ERROR: ({ message }: any = {}) => message || 'Internal server error',
};

export enum ErrorCode {
  INVALID_PARAMETERS = 'INVALID_PARAMETERS',
  ENTITY_NOT_FOUND = 'ENTITY_NOT_FOUND',
  ENTITY_ALREADY_EXISTS = 'ENTITY_ALREADY_EXISTS',
  INVALID_HEADER = 'INVALID_HEADER',
  RESOURCE_CONFLICT = 'RESOURCE_CONFLICT',
  INTERNAL_SERVER_ERROR = 'INTERNAL_SERVER_ERROR',
}
