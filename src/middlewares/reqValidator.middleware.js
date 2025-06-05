import { validationResult } from "express-validator"
import APIError from "../configure/error.configure.js";

const reqValidator = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        throw new APIError(`${errors.array().map(err => err.msg).join(", ")}`, 400)
    }
    next();
}

export default reqValidator;