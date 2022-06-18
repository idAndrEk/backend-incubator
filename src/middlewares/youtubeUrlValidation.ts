import {NextFunction, Request, Response} from "express";
import {validationResult} from "express-validator";

export function youtubeUrlValidation (
    req: Request,
    res: Response,
    next: NextFunction) {

    const errors = validationResult(req.body.youtubeUrl);
    if (!errors.isEmpty()) {
        return res.status(400).send({
            message: 'Error youtubeUrl',
            field: 'youtubeUrl'
        })
    } else {
        next();
    }
}


