// Lets the service layer throw errors with an HTTP status,
// which the central error handler maps to a response.
export default class ApiError extends Error {
  constructor(statusCode, message) {
    super(message);
    this.statusCode = statusCode;
    this.name = 'ApiError';
  }
}
