import {body} from "express-validator";

export const userValidationLogin = [
    body('login')
        .isLength({max: 10, min: 3})
        .isString()
]

export const userValidationPassword = [
    body('password')
        .isLength({max: 20, min: 6})
        .isString()
]

export const userValidationEmail = [
    body('email')
        .trim()
        .isString()
        .matches('^[\\w-\\.]+@([\\w-]+\\.)+[\\w-]{2,4}$')
]

export const userValidationCode = [
    body('code')
        .isString()
]
