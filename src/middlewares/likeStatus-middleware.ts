import {body} from "express-validator";

export  const  likeStatusMiddleware = body('likeStatus')
    .custom((value) =>{
        if(value !== 'None' && value !== 'Like' && value !== 'Dislike'){
            return Promise.reject(`Error ${value}`)
        }else {
            return true
        }
    })