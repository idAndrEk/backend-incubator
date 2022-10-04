import {CommentsService} from "../domain/comments-service";
import {PostsService} from "../domain/posts-service";
import {BloggersService} from "../domain/bloggers-service";
import {Request, Response} from "express";
import {injectable} from "inversify";
import {LikesRepository} from "../repositories/like-repoository";

@injectable()
export class PostsController {

    constructor(protected postsService: PostsService,
                protected bloggersService: BloggersService,
                protected commentsService: CommentsService,
                protected likesRepository: LikesRepository
    ) {
    }

    async getPosts(req: Request, res: Response) {
        try {
            const page = req.query.PageNumber || 1
            const pageSize = req.query.PageSize || 10
            const posts = await this.postsService.getPosts(+page, +pageSize, req.user)
            return res.status(200).send(posts)
        } catch (error) {
            console.log(error)
            return res.send('Error')
        }
    }

    async getPost(req: Request, res: Response) {
        try {
            const post = await this.postsService.getPost(req.params.id, req.user);
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
            const bloggerId = req.body.bloggerId;
            const newPost = await this.postsService.createPost(titlePost, shortDescriptionPost, contentPost, bloggerId)
            if (!newPost) {
                const errors = [];
                errors.push({message: 'Error bloggerId', field: 'bloggerId'})
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
            const blogger = await this.bloggersService.getBlogger(req.body.bloggerId);
            if (blogger) {
                const postId = req.params.id;
                const titlePost = req.body.title;
                const shortDescriptionPost = req.body.shortDescription;
                const contentPost = req.body.content;
                const bloggerId = req.body.bloggerId;
                const result = await this.postsService.updatePost(postId, titlePost, shortDescriptionPost, contentPost, bloggerId)
                if (result) return res.sendStatus(204)
                return res.sendStatus(404)
            }
            const errors = [];
            errors.push({message: 'Error bloggerId', field: 'bloggerId'})
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
            const post = await this.postsService.getPost(req.params.id, req.user);
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
            let page = req.query.PageNumber || 1
            let pageSize = req.query.PageSize || 10
            const postId = req.params.id
            const post = await this.postsService.checkPost(postId)
            if (post) {
                const postComment = await this.postsService.getPostComment(postId, +page, +pageSize, req.user)
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
            const post = await this.postsService.checkPost(postId);
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

