/**
 * Global error handler for API responses according to FRONTEND_GUIDE.md
 */

export interface ApiError {
  error: string;
}

export const handleApiError = (error: Error, navigate?: (path: string) => void) => {
  const errorMessage = error.message;

  // Authentication errors - redirect to login
  if (errorMessage.includes('Token expired') ||
      errorMessage.includes('Invalid token') ||
      errorMessage.includes('Invalid or expired token')) {
    localStorage.removeItem('token');
    if (navigate) {
      navigate('/auth/login');
    } else {
      window.location.href = '/auth/login';
    }
    return;
  }

  // Permission errors
  if (errorMessage.includes('Access denied') ||
      errorMessage.includes('Forbidden')) {
    alert('No tienes permisos para esta acción');
    return;
  }

  // Resource not found errors
  if (errorMessage.includes('Event not found') ||
      errorMessage.includes('Participant not found')) {
    alert('El recurso solicitado no existe o no tienes acceso');
    return;
  }

  // Validation errors
  if (errorMessage.includes('field1:') ||
      errorMessage.includes('field2:')) {
    alert('Datos inválidos: ' + errorMessage);
    return;
  }

  // Rate limiting errors
  if (errorMessage.includes('Too many')) {
    alert('Demasiadas solicitudes. Inténtalo de nuevo más tarde.');
    return;
  }

  // Generic error
  alert('Error inesperado: ' + errorMessage);
};

/**
 * Enhanced error handler with more specific actions
 */
export const handleApiErrorAdvanced = (
  error: Error,
  options: {
    onAuthError?: () => void;
    onPermissionError?: () => void;
    onNotFoundError?: () => void;
    onValidationError?: (message: string) => void;
    onRateLimitError?: () => void;
    onGenericError?: (message: string) => void;
  } = {}
) => {
  const errorMessage = error.message;

  // Authentication errors
  if (errorMessage.includes('Token expired') ||
      errorMessage.includes('Invalid token') ||
      errorMessage.includes('Invalid or expired token')) {
    if (options.onAuthError) {
      options.onAuthError();
    } else {
      localStorage.removeItem('token');
      window.location.href = '/auth/login';
    }
    return;
  }

  // Permission errors
  if (errorMessage.includes('Access denied') ||
      errorMessage.includes('Forbidden')) {
    if (options.onPermissionError) {
      options.onPermissionError();
    } else {
      alert('No tienes permisos para esta acción');
    }
    return;
  }

  // Resource not found errors
  if (errorMessage.includes('Event not found') ||
      errorMessage.includes('Participant not found')) {
    if (options.onNotFoundError) {
      options.onNotFoundError();
    } else {
      alert('El recurso solicitado no existe o no tienes acceso');
    }
    return;
  }

  // Validation errors
  if (errorMessage.includes('field1:') ||
      errorMessage.includes('field2:')) {
    if (options.onValidationError) {
      options.onValidationError(errorMessage);
    } else {
      alert('Datos inválidos: ' + errorMessage);
    }
    return;
  }

  // Rate limiting errors
  if (errorMessage.includes('Too many')) {
    if (options.onRateLimitError) {
      options.onRateLimitError();
    } else {
      alert('Demasiadas solicitudes. Inténtalo de nuevo más tarde.');
    }
    return;
  }

  // Generic error
  if (options.onGenericError) {
    options.onGenericError(errorMessage);
  } else {
    alert('Error inesperado: ' + errorMessage);
  }
};

/**
 * Check if error is authentication related
 */
export const isAuthError = (error: Error): boolean => {
  const errorMessage = error.message;
  return errorMessage.includes('Token expired') ||
         errorMessage.includes('Invalid token') ||
         errorMessage.includes('Invalid or expired token');
};

/**
 * Check if error is permission related
 */
export const isPermissionError = (error: Error): boolean => {
  const errorMessage = error.message;
  return errorMessage.includes('Access denied') ||
         errorMessage.includes('Forbidden');
};

/**
 * Check if error is validation related
 */
export const isValidationError = (error: Error): boolean => {
  const errorMessage = error.message;
  return errorMessage.includes('field1:') ||
         errorMessage.includes('field2:');
};

/**
 * Check if error is rate limiting related
 */
export const isRateLimitError = (error: Error): boolean => {
  const errorMessage = error.message;
  return errorMessage.includes('Too many');
};

/**
 * Check if error is resource not found related
 */
export const isNotFoundError = (error: Error): boolean => {
  const errorMessage = error.message;
  return errorMessage.includes('Event not found') ||
         errorMessage.includes('Participant not found');
};