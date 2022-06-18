import {body} from "express-validator";

export const shema = [
    body('name')
        .exists({checkFalsy: true})
        .isString()
        .isLength({max: 15})
        .withMessage('error name'),
    body('youtubeUrl')
        .exists({checkFalsy: true})
        .isString()
        .isLength({max: 100})
        .isURL()
        .withMessage('error youtubeUrl')
    ]

