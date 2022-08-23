import {body} from "express-validator";

export const userValidation = [
    body('login')
        .isLength({max: 10, min: 3})
        .isString(),
    body('password')
        .isLength({max: 20, min: 6})
        .isString(),
    body('email')
        .trim()
        .isString()
        .matches('^[\\w-\\.]+@([\\w-]+\\.)+[\\w-]{2,4}$')
]