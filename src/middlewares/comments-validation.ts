import {body} from "express-validator";

export const commentValidation = [
    body('content')
        .isLength({max: 300, min: 20})
]