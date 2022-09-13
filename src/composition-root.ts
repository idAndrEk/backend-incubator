import {BloggersRepository} from "./repositories/bloggers-repository";
import {BloggersService} from "./domain/bloggers-service";
import {BloggersController} from "./controllers/bloggers-controller";
import {PostsRepository} from "./repositories/posts-repository";
import {PostsService} from "./domain/posts-service";
import {PostsController} from "./controllers/posts-controller";
import {CommentsRepository} from "./repositories/comments-repository";
import {CommentsService} from "./domain/comments-service";
import {CommentsController} from "./controllers/comments-controller";
import {UsersService} from "./domain/users-service";
import {UsersRepository} from "./repositories/users-repository";
import {UsersController} from "./controllers/users-controller";
import {AuthController} from "./controllers/auth-controller"
import {JwtService} from "./application/jwt-service";

const bloggersRepository = new BloggersRepository()
const postsRepository = new PostsRepository()
const commentsRepository = new CommentsRepository()
const usersRepository = new UsersRepository


const bloggersService = new BloggersService(bloggersRepository)
const postsService = new PostsService(postsRepository, bloggersRepository)
const commentsService = new CommentsService(commentsRepository)
export const usersService = new UsersService(usersRepository)
export const jwtService = new JwtService()


export const bloggersController = new BloggersController(bloggersService, postsService)
export const postsController = new PostsController(postsService, bloggersService, commentsService)
export const commentsController = new CommentsController(commentsService)
export const usersController = new UsersController(usersService)
export const authController = new AuthController(usersService)






