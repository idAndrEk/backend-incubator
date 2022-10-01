import {Router} from "express";
import {allValidation} from "../middlewares/ValidationError";
import {BloggerValidation} from "../middlewares/Blogger-validation";
import {authMiddleware} from "../middlewares/auth-middleware";
import {postValidation} from "../middlewares/Post-validation";
import {checkIdParamMiddleware} from "../middlewares/checkIdParam-Middleware";
import {container} from "../composition-root";
import {BloggersController} from "../controllers/bloggers-controller";
import {checkUserTokenMiddleware} from "../middlewares/JwtAuth-Middleware";

const bloggersController = container.resolve(BloggersController)

export const bloggersRouter = Router({})

bloggersRouter.get('/', bloggersController.getBloggers.bind(bloggersController))
bloggersRouter.get('/:id', checkIdParamMiddleware, bloggersController.getBlogger.bind(bloggersController))
bloggersRouter.post('/', authMiddleware, BloggerValidation, allValidation, bloggersController.createBlogger.bind(bloggersController))
bloggersRouter.put('/:id', checkIdParamMiddleware, authMiddleware, BloggerValidation, allValidation, bloggersController.updateBlogger.bind(bloggersController))
bloggersRouter.delete('/:id', checkIdParamMiddleware, authMiddleware, bloggersController.deleteBlogger.bind(bloggersController))
bloggersRouter.get('/:id/posts', checkUserTokenMiddleware, checkIdParamMiddleware, bloggersController.getBloggerPosts.bind(bloggersController))
bloggersRouter.post('/:id/posts', checkIdParamMiddleware, authMiddleware, postValidation, allValidation, bloggersController.createPostBlogger.bind(bloggersController))





