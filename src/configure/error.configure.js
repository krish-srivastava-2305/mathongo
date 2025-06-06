/*
    Custom error class for API errors
    This class extends the built-in Error class and includes a status code.
    It provides a method to convert the error to a JSON format for consistent API responses.
    Usage:
    throw new APIError("Error message", 400);
    This will create an error with the message "Error message" and a status code of 400.
    The error can be caught in an error handling middleware and returned as a JSON response.
*/
class APIError extends Error {
    constructor(message, statusCode) {
        super(message);
        this.statusCode = statusCode;
        this.name = this.constructor.name;
        Error.captureStackTrace(this, this.constructor);
    }
    toJson() {
        return {
            message: this.message,
            statusCode: this.statusCode,
            name: this.name
        }
    }
}

export default APIError;