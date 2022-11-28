import "reflect-metadata";
import {Container} from "inversify";
import {BloggersRepository} from "./repositories/blogs/bloggers-repository";
import {BlogsService} from "./domain/blogs-service";
import {BlogsController} from "./controllers/blogs.controller";
import {PostsRepository} from "./repositories/posts/posts-repository";
import {PostsService} from "./domain/posts-service";
import {PostsController} from "./controllers/posts-controller";
import {CommentsRepository} from "./repositories/comments/comments-repository";
import {CommentsService} from "./domain/comments-service";
import {CommentsController} from "./controllers/comments-controller";
import {UsersService} from "./domain/users-service";
import {UsersRepository} from "./repositories/users/users-repository";
import {UsersController} from "./controllers/users-controller";
import {AuthController} from "./controllers/auth-controller"
import {JwtService} from "./application/jwt-service";
import {LikesRepository} from "./repositories/like-repoository";
import {BlogsQueryRepository} from "./repositories/blogs/blogsQueryRepository";
import {PostsQueryRepository} from "./repositories/posts/postsQueryRepository";
import {CommentsQueryRepository} from "./repositories/comments/commentsQueryRepository";
import {UsersQueryRepository} from "./repositories/users/usersQueryRepository";
import {DevicesController} from "./controllers/devices-controller";
import {DevicesService} from "./domain/devices-service";
import {DevicesRepository} from "./repositories/devices-repository";

export const jwtService = new JwtService()
// export const likesRepository = new LikesRepository
// const usersRepository = new UsersRepository
// export const usersService = new UsersService(usersRepository)
// export const usersQueryRepository = new UsersQueryRepository


export const container = new Container();

container.bind<BlogsController>(BlogsController).to(BlogsController);
container.bind<BlogsService>(BlogsService).to(BlogsService);
container.bind<BloggersRepository>(BloggersRepository).to(BloggersRepository);
container.bind<BlogsQueryRepository>(BlogsQueryRepository).to(BlogsQueryRepository);

container.bind<LikesRepository>(LikesRepository).to(LikesRepository);

container.bind<PostsController>(PostsController).to(PostsController);
container.bind<PostsService>(PostsService).to(PostsService);
container.bind<PostsRepository>(PostsRepository).to(PostsRepository);
container.bind<PostsQueryRepository>(PostsQueryRepository).to(PostsQueryRepository);

container.bind<CommentsController>(CommentsController).to(CommentsController);
container.bind<CommentsService>(CommentsService).to(CommentsService);
container.bind<CommentsRepository>(CommentsRepository).to(CommentsRepository);
container.bind<CommentsQueryRepository>(CommentsQueryRepository).to(CommentsQueryRepository);

container.bind<UsersController>(UsersController).to(UsersController);
container.bind<UsersService>(UsersService).to(UsersService);
container.bind<UsersRepository>(UsersRepository).to(UsersRepository);
container.bind<UsersQueryRepository>(UsersQueryRepository).to(UsersQueryRepository);

container.bind<AuthController>(AuthController).to(AuthController);

container.bind<DevicesController>(DevicesController).to(DevicesController)
container.bind<DevicesService>(DevicesService).to(DevicesService)
container.bind<DevicesRepository>(DevicesRepository).to(DevicesRepository)

