import {Router} from "express";
import {postValidation} from "../middlewares/Post-validation";
import {allValidation} from "../middlewares/ValidationError";
import {authMiddleware, authMiddlewareUser,} from "../middlewares/auth-middleware";
import {commentValidation} from "../middlewares/comments-validation";
import {checkIdParamMiddleware} from "../middlewares/checkIdParam-Middleware";
import {container} from "../composition-root";
import {PostsController} from "../controllers/posts-controller";
import {JwtAuthMiddleware} from "../middlewares/JwtAuth-Middleware";

const postsController = container.resolve(PostsController)

export const postsRouter = Router({})

// ОЧЕРЕДНОСТЬ

postsRouter.get('/', postsController.getPosts.bind(postsController))
postsRouter.get('/:id', checkIdParamMiddleware, postsController.getPost.bind(postsController))
postsRouter.post('/', authMiddleware, postValidation, allValidation, postsController.createPost.bind(postsController))
postsRouter.post('/:id/comments', checkIdParamMiddleware, JwtAuthMiddleware, commentValidation, allValidation, postsController.createComment.bind(postsController))
postsRouter.put('/:id/like-status', JwtAuthMiddleware, allValidation, postsController.addLikeToPost.bind(postsController))
postsRouter.put('/:id', checkIdParamMiddleware, authMiddleware, postValidation, allValidation, postsController.updatePost.bind(postsController))
postsRouter.delete('/:id', checkIdParamMiddleware, authMiddleware, postsController.deletePost.bind(postsController))
postsRouter.get('/:id/comments', checkIdParamMiddleware, postsController.getCommentPost.bind(postsController))
