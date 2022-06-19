import {body} from "express-validator";

export const userValidation = [
    body('Username')
        .exists({checkFalsy: true})
        .withMessage('Error name'),
    body('Password')
        .isLength({min: 5})
        .withMessage('password must be at least 5 character long')
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