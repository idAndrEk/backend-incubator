import "reflect-metadata";
import {Container} from "inversify";
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
import {LikesRepository} from "./repositories/like-repoository";

export const jwtService = new JwtService()

const usersRepository = new UsersRepository

export const usersService = new UsersService(usersRepository)

export const container = new Container();

container.bind<BloggersController>(BloggersController).to(BloggersController);
container.bind<BloggersService>(BloggersService).to(BloggersService);
container.bind<BloggersRepository>(BloggersRepository).to(BloggersRepository);

container.bind<LikesRepository>(LikesRepository).to(LikesRepository)

container.bind<PostsController>(PostsController).to(PostsController);
container.bind<PostsService>(PostsService).to(PostsService);
container.bind<PostsRepository>(PostsRepository).to(PostsRepository);

container.bind<CommentsController>(CommentsController).to(CommentsController);
container.bind<CommentsService>(CommentsService).to(CommentsService);
container.bind<CommentsRepository>(CommentsRepository).to(CommentsRepository);

container.bind<UsersController>(UsersController).to(UsersController);
container.bind<UsersService>(UsersService).to(UsersService);
container.bind<UsersRepository>(UsersRepository).to(UsersRepository);

container.bind<AuthController>(AuthController).to(AuthController);


