import APIError from "../configure/error.configure.js";

const errorHandler = (err, req, res, next) => {
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