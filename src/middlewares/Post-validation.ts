import {body} from "express-validator";

export const postValidation = [
    body('title')
        // .exists({checkFalsy: true})
        .notEmpty()
        .isString()
        .trim()
        .isLength({max: 30, min: 3})
        .withMessage('Error title'),
    body('shortDescription')
        .notEmpty()
        .isString()
        .trim()
        .isLength({max: 100, min: 3})
        .withMessage('Error shortDescription'),
    body('content')
        .isString()
        .trim()
        .isLength({max: 1000, min: 3})
        .withMessage('Error content')
    ]



// const errors = []
// if (typeof req.body.title !== "string" || req.body.title.length > 30 || req.body.title.trim() === "") {
//     errors.push({message: 'Error title', field: 'title'})
// }
// if (typeof req.body.shortDescription !== "string" || req.body.shortDescription.length > 100 || req.body.shortDescription.trim() === "") {
//     errors.push({message: 'Error shortDescription', field: 'shortDescription'})
// }
// if (typeof req.body.content !== "string" || req.body.content.length > 1000 || req.body.content.trim() === "") {
//     errors.push({message: 'Error content', field: 'content'})
// }
// if (errors.length) {
//     res.status(400).json({
//         errorsMessages: errors
//     })
//     return
// }