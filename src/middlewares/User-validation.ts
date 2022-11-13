import {body} from "express-validator";

export const userValidationLogin = [
    body('login')
        .isLength({max: 10, min: 3})
        .isString()
    // .withMessage('password or login is wrong')
]

export const userValidationPassword = [
    body('password')
        .isLength({max: 20, min: 6})
        .isString()
    // .withMessage('password or login is wrong')
]

export const userValidationNewPassword = [
    body('newPassword')
        .isLength({max: 20, min: 6})
        .isString()
    // .withMessage('password or login is wrong')
]

export const userValidationEmail = [
    body('email')
        .trim()
        .isString()
        .isEmail()
        // .matches('^[\\w-\\.]+@([\\w-]+\\.)+[\\w-]{2,4}$')
]

export const userValidationCode = [
    body('code')
        .isUUID()
]

export const validationRecoveryCode = [
    body('recoveryCode')
        .isUUID()
]

