import {Router} from "express";
import {postValidation} from "../middlewares/Post-validation";
import {allValidation} from "../middlewares/ValidationError";
import {authMiddleware, authMiddlewareUser,} from "../middlewares/auth-middleware";
import {commentValidation} from "../middlewares/comments-validation";
import {checkIdParamMiddleware} from "../middlewares/checkIdParam-Middleware";
import {postsController} from "../composition-root";

export const postsRouter = Router({})

postsRouter.get('/', postsController.getPosts.bind(postsController))
postsRouter.get('/:id', checkIdParamMiddleware, postsController.getPost.bind(postsController))
postsRouter.post('/', authMiddleware, postValidation, allValidation, postsController.createPost.bind(postsController))
postsRouter.put('/:id', checkIdParamMiddleware, authMiddleware, postValidation, allValidation, postsController.updatePost.bind(postsController))
postsRouter.delete('/:id', checkIdParamMiddleware, authMiddleware, postsController.deletePost.bind(postsController))
postsRouter.get('/:id/comments', checkIdParamMiddleware, postsController.getCommentPost.bind(postsController))
postsRouter.post('/:id/comments', checkIdParamMiddleware, authMiddlewareUser, commentValidation, allValidation, postsController.createComment.bind(postsController))