import {CommentsService} from "../domain/comments-service";
import {PostsService} from "../domain/posts-service";
import {BloggersService} from "../domain/bloggers-service";
import {Request, Response} from "express";
import {injectable} from "inversify";
import {LikesRepository} from "../repositories/like-repoository";
import {SortBy, SortDirection} from "../types/paginationType";
import {BlogsQueryRepository} from "../repositories/blogs/blogsQueryRepository";
import {PostsQueryRepository} from "../repositories/posts/postsQueryRepository";

@injectable()
export class PostsController {

    constructor(protected postsService: PostsService,
                protected bloggersService: BloggersService,
                protected commentsService: CommentsService,
                protected likesRepository: LikesRepository,
                protected blogsQueryRepository: BlogsQueryRepository,
                protected postsQueryRepository: PostsQueryRepository) {}

    async getPosts(req: Request, res: Response) {
        try {
            const page = req.query.PageNumber || 1
            const pageSize = req.query.PageSize || 10
            let sortBy = req.query.sortBy ?? "createdAt"
            let sortDirection: SortDirection = req.query.sortDirection === 'asc' ? SortDirection.Asc : SortDirection.Desc
            const posts = await this.postsQueryRepository.getPosts(+page, +pageSize, req.user, sortBy.toString(), sortDirection)
            return res.status(200).send(posts)
        } catch (error) {
            console.log(error)
            return res.send('Error')
        }
    }

    async getPost(req: Request, res: Response) {
        try {
            const post = await this.postsQueryRepository.getPost(req.params.id, req.user);
            if (post) return res.status(200).send(post)
            return res.status(404).send('Not found')
        } catch (error) {
            console.log(error)
            return res.send('Error')
        }
    }

    async createPost(req: Request, res: Response) {
        try {
            const titlePost = req.body.title;
            const shortDescriptionPost = req.body.shortDescription;
            const contentPost = req.body.content;
            const blogId = req.body.blogId;
            const newPost = await this.postsService.createPost(titlePost, shortDescriptionPost, contentPost, blogId)
            if (!newPost) {
                const errors = [];
                errors.push({message: 'Error blogId', field: 'blogId'})
                if (errors.length) {
                    res.status(400).json({
                        errorsMessages: errors
                    })
                    return
                }
            }
            return res.status(201).send(newPost)
        } catch (error) {
            console.log(error)
            return res.send('Error')
        }
    }

    async updatePost(req: Request, res: Response) {
        try {
            const blogger = await this.blogsQueryRepository.getBlog(req.body.blogId);
            if (blogger) {
                const postId = req.params.id;
                const titlePost = req.body.title;
                const shortDescriptionPost = req.body.shortDescription;
                const contentPost = req.body.content;
                const blogId = req.body.blogId;
                const result = await this.postsService.updatePost(postId, titlePost, shortDescriptionPost, contentPost, blogId)
                if (result) return res.sendStatus(204)
                return res.sendStatus(404)
            }
            const errors = [];
            errors.push({message: 'Error blogId', field: 'blogId'})
            if (errors.length) {
                res.status(400).json({
                    errorsMessages: errors
                })
            }
            return
        } catch (error) {
            console.log(error)
            return res.send('Error')
        }
    }

    async addLikeToPost(req: Request<{ id: string }, never, { likeStatus: string }, never>, res: Response) {
        try {
            const post = await this.postsQueryRepository.getPost(req.params.id, req.user);
            if (!post) return res.sendStatus(404)
            const postId = req.params.id;
            const userId = req.user.id;
            const login = req.user.accountData.userName;
            const {likeStatus} = req.body;
            await this.postsService.addLikeToPost(postId, userId, login, likeStatus)
            return res.sendStatus(204)
        } catch (error) {
            console.log(error)
            return res.send('Error')
        }
    }

    async deletePost(req: Request, res: Response) {
        try {
            const idDeletedPost = await this.postsService.deletePost(req.params.id)
            if (idDeletedPost) return res.sendStatus(204)
            return res.sendStatus(404)
        } catch (error) {
            console.log(error)
            return res.send('Error')
        }
    }

    async getCommentPost(req: Request, res: Response) {
        try {
            let page = req.query.pageNumber || 1
            let pageSize = req.query.pageSize || 10
            let sortBy = req.query.sortBy ?? "createdAt"
            // let sortBy = req.query.sortBy === 'name' ? SortBy.Name : SortBy.CreatedAt
            let sortDirection: SortDirection = req.query.sortDirection === 'asc' ? SortDirection.Asc : SortDirection.Desc
            // const user = req.user
            const postId = req.params.id
            const post = await this.postsQueryRepository.checkPost(postId)
            if (post) {
                const postComment = await this.postsService.getPostComment(postId, +page, +pageSize, sortBy.toString(), sortDirection)
                return res.status(200).send(postComment)
            } else {
                const errors = [];
                errors.push({message: 'Error postId', field: 'postId'})
                res.status(404).json({
                    errorsMessages: errors
                })
                return
            }
        } catch (error) {
            console.log(error)
            return res.send('Error')
        }
    }

    async createComment(req: Request, res: Response) {
        try {
            const postId = req.params.id;
            const post = await this.postsQueryRepository.checkPost(postId);
            if (!post) return res.sendStatus(404)
            const content = req.body.content;
            const userId = req.user.id;
            const userLogin = req.user.accountData.userName;
            const newCommentPost = await this.commentsService.createComment(postId, content, userId, userLogin)
            if (newCommentPost) return res.status(201).send(newCommentPost)
            const errors = [];
            errors.push({message: 'Error postId', field: 'postId'});
            res.status(404).json({
                errorsMessages: errors
            })
            return
        } catch (error) {
            console.log(error)
            return res.send('Error')
        }
    }

}

