/**
 * Utility class for consistent API response formatting
 */
class ResponseUtil {
  /**
   * Send a success response
   * @param {Object} res - Express response object
   * @param {number} statusCode - HTTP status code
   * @param {string} message - Success message
   * @param {Object} data - Response data
   */
  static success(res, statusCode = 200, message = 'Success', data = null) {
    const response = {
      success: true,
      message
    };

    if (data !== null) {
      response.data = data;
    }

    return res.status(statusCode).json(response);
  }

  /**
   * Send an error response
   * @param {Object} res - Express response object
   * @param {number} statusCode - HTTP status code
   * @param {string} message - Error message
   * @param {Object} errors - Detailed errors
   */
  static error(res, statusCode = 500, message = 'Internal Server Error', errors = null) {
    const response = {
      success: false,
      message
    };

    if (errors !== null) {
      response.errors = errors;
    }

    return res.status(statusCode).json(response);
  }

  /**
   * Send a validation error response
   * @param {Object} res - Express response object
   * @param {Object} errors - Validation errors
   */
  static validationError(res, errors) {
    return this.error(res, 400, 'Validation Error', errors);
  }

  /**
   * Send a not found error response
   * @param {Object} res - Express response object
   * @param {string} message - Not found message
   */
  static notFound(res, message = 'Resource not found') {
    return this.error(res, 404, message);
  }

  /**
   * Send an unauthorized error response
   * @param {Object} res - Express response object
   * @param {string} message - Unauthorized message
   */
  static unauthorized(res, message = 'Unauthorized access') {
    return this.error(res, 401, message);
  }

  /**
   * Send a forbidden error response
   * @param {Object} res - Express response object
   * @param {string} message - Forbidden message
   */
  static forbidden(res, message = 'Access forbidden') {
    return this.error(res, 403, message);
  }
}

module.exports = ResponseUtil;
