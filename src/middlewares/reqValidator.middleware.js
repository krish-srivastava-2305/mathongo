import { validationResult } from "express-validator"
import APIError from "../configure/error.configure.js";

// Middleware to validate request parameters using express-validator
// This middleware checks for validation errors in the request and throws an APIError if any are found.
const reqValidator = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        throw new APIError(`${errors.array().map(err => err.msg).join(", ")}`, 400)
    }
    next();
}

export default reqValidator;