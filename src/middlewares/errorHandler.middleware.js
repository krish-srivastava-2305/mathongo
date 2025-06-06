import APIError from "../configure/error.configure.js";

// Error handling middleware
// This middleware catches errors thrown in the application and formats them into a consistent JSON response.
const errorHandler = (err, req, res) => {
    console.error(err.stack)
    if (err instanceof APIError) {
        return res.status(err.statusCode).json(err.toJson());
    }
    return res.status(500).json({
        message: "Internal Server Error",
        status: 500,
        name: "InternalServerError",
    });
}

export default errorHandler;