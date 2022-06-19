import {body} from "express-validator";

export const BloggerValidation = [
    body('name')
        // .exists({checkFalsy: true})
        .notEmpty()
        .isString()
        .trim()
        .isLength({max: 15, min: 3})
        .withMessage('Error name'),
    body('youtubeUrl')
        .notEmpty()
        .isString()
        .trim()
        .isLength({max: 100, min: 3})
        // .isURL()
        .matches('^https:\/\/([a-zA-Z0-9_-]+\.)+[a-zA-Z0-9_-]+(\/[a-zA-Z0-9_-]+)*\/?$')
        .withMessage('Error youtubeUrl')
    ]

// const reges = RegExp('^https:\/\/([a-zA-Z0-9_-]+\.)+[a-zA-Z0-9_-]+(\/[a-zA-Z0-9_-]+)*\/?$');
// const errors = [];
// if (typeof name !== "string" || name.length > 15 || !name || name.trim() === "" ) {
//     errors.push({message: 'Error name', field: 'name'})
// }
// if (youtubeUrl.length > 100 || typeof youtubeUrl !== "string" || !youtubeUrl || youtubeUrl.trim() === "" || !youtubeUrl.match(reges)) {
//     errors.push({message: 'Error youtubeUrl', field: 'youtubeUrl'})
// }
// if (errors.length) {
//     return({errorsMessages: errors})
// } else {