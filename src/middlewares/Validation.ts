import {NextFunction, Request, Response} from "express";
import {validationResult} from "express-validator";

export const allValidation = (
    req: Request,
    res: Response,
    next: NextFunction) => {

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        const errResult = errors.array({onlyFirstError: true}).map((error => {
            // const errorsObject = {message: error.msg, field: error.param}
            // return errorsObject
            return  {message: error.msg, field: error.param}
        }))
        return res.status(400).json({errorsMessages: errResult});
    }
    next()
}
// validationResult(req).array({ onlyFirstError: true }).