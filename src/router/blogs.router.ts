import {Router} from "express";
import {allValidation} from "../middlewares/ValidationError";
import {BloggerValidation} from "../middlewares/Blogger-validation";
import {authMiddleware} from "../middlewares/auth-middleware";
import {postValidation} from "../middlewares/Post-validation";
import {checkIdParamMiddleware} from "../middlewares/checkIdParam-Middleware";
import {container} from "../composition-root";
import {BlogsController} from "../controllers/blogs.controller";
import {checkUserTokenMiddleware} from "../middlewares/JwtAuth-Middleware";

const bloggersController = container.resolve(BlogsController)

export const blogsRouter = Router({})

blogsRouter.get('/', bloggersController.getBlogs.bind(bloggersController))
blogsRouter.get('/:id', checkIdParamMiddleware, bloggersController.getBlog.bind(bloggersController))
blogsRouter.get('/:id/posts', checkUserTokenMiddleware, checkIdParamMiddleware, bloggersController.getBloggerPosts.bind(bloggersController))
blogsRouter.post('/', authMiddleware, BloggerValidation, allValidation, bloggersController.createBlogger.bind(bloggersController))
blogsRouter.post('/:id/posts', checkIdParamMiddleware, authMiddleware, postValidation, allValidation, bloggersController.createPostBlogger.bind(bloggersController))
blogsRouter.put('/:id', checkIdParamMiddleware, authMiddleware, BloggerValidation, allValidation, bloggersController.updateBlogger.bind(bloggersController))
blogsRouter.delete('/:id', checkIdParamMiddleware, authMiddleware, bloggersController.deleteBlogger.bind(bloggersController))





