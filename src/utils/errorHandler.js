export class ApiError extends Error {
  constructor(message, status, code, details = null) {
    super(message);
    this.status = status;
    this.code = code;
    this.details = details;
    this.name = 'ApiError';
  }
}

export const errorHandler = {
  handle(error) {
    if (error instanceof ApiError) {
      return this.handleApiError(error);
    }
    return this.handleGenericError(error);
  },

  handleApiError(error) {
    switch (error.status) {
      case 400:
        return {
          message: 'Invalid data',
          details: error.details,
          type: 'validation'
        };
      case 401:
        return {
          message: 'Session expired',
          type: 'auth'
        };
      case 403:
        return {
          message: 'No tienes permisos para realizar esta acción',
          type: 'permission'
        };
      case 404:
        return {
          message: 'Recurso no encontrado',
          type: 'not_found'
        };
      case 500:
        return {
          message: 'Error en el servidor',
          type: 'server'
        };
      default:
        return {
          message: 'Error desconocido',
          type: 'unknown'
        };
    }
  },

  handleGenericError(error) {
    return {
      message: 'Ha ocurrido un error inesperado',
      type: 'generic'
    };
  }
}; 