import {Router} from "express";
import {authMiddlewareUser} from "../middlewares/auth-middleware";
import {commentValidation} from "../middlewares/comments-validation";
import {allValidation} from "../middlewares/ValidationError";
import {checkIdParamMiddleware} from "../middlewares/checkIdParam-Middleware";
import {container} from "../composition-root";
import {CommentsController} from "../controllers/comments-controller";
import {checkUserTokenMiddleware, JwtAuthMiddleware} from "../middlewares/JwtAuth-Middleware";
import {likeStatusMiddleware} from "../middlewares/likeStatus-middleware";

const commentsController = container.resolve(CommentsController)

export const commentsRouter = Router({})

commentsRouter.get('/:id', checkUserTokenMiddleware, checkIdParamMiddleware, commentsController.getComment.bind(commentsController))
commentsRouter.put('/:id/like-status', JwtAuthMiddleware, likeStatusMiddleware, allValidation, commentsController.addLikeToComment.bind(commentsController))
commentsRouter.put('/:id', checkIdParamMiddleware, authMiddlewareUser, commentValidation, allValidation, commentsController.updateComment.bind(commentsController))
commentsRouter.delete('/:id', checkIdParamMiddleware, authMiddlewareUser, commentsController.deleteComment.bind(commentsController))


