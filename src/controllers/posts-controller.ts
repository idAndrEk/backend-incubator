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
    ) {}

    async getPosts(req: Request, res: Response) {
        const page = req.query.PageNumber || 1
        const pageSize = req.query.PageSize || 10
        const posts = await this.postsService.getPosts(+page, +pageSize, req.user)
        return res.status(200).send(posts)
    }

    async getPost(req: Request, res: Response) {
        const post = await this.postsService.getPost(req.params.id, req.user);
        if (!post) {
            res.status(404).send('Not found')
        } else {
            res.status(200).send(post)
        }
    }

    async createPost(req: Request, res: Response) {
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
    }

    async updatePost(req: Request, res: Response) {
        const blogger = await this.bloggersService.getBlogger(req.body.bloggerId);
        if (blogger) {
            const idPost = req.params.id;
            const titlePost = req.body.title;
            const shortDescriptionPost = req.body.shortDescription;
            const contentPost = req.body.content;
            const bloggerId = req.body.bloggerId;
            const result = await this.postsService.updatePost(idPost, titlePost, shortDescriptionPost, contentPost, bloggerId)
            if (result) {
                res.sendStatus(204)
                return;
            }
            res.sendStatus(404)
            return
        }
        const errors = [];
        errors.push({message: 'Error bloggerId', field: 'bloggerId'})
        if (errors.length) {
            res.status(400).json({
                errorsMessages: errors
            })
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
            return res.status(500).send(error)
        }
    }

    async deletePost(req: Request, res: Response) {
        const idDeletedPost = await this.postsService.deletePost(req.params.id)
        if (idDeletedPost) {
            res.sendStatus(204)
        } else {
            res.sendStatus(404)
        }
    }

    async getCommentPost(req: Request, res: Response) {
        let page = req.query.PageNumber || 1
        let pageSize = req.query.PageSize || 10
        const postId = req.params.id
        const post = await this.postsService.checkPost(postId)
        if (post) {
            const postComment = await this.postsService.getPostComment(postId, +page, +pageSize)
            return res.status(200).send(postComment)
        } else {
            const errors = [];
            errors.push({message: 'Error postId', field: 'postId'})
            res.status(404).json({
                errorsMessages: errors
            })
            return
        }
    }

    async createComment(req: Request, res: Response) {
        const post = await this.postsService.checkPost(req.params.id);
        if (!post) return res.sendStatus(404)
        const postId = req.params.id;
        const content = req.body.content;

        const userId = req.user.id;
        const userLogin = req.user.accountData.userName;
        const newCommentPost = await this.commentsService.createComment(content, userId, userLogin)
        return res.status(201).send(newCommentPost)
        const errors = [];
        errors.push({message: 'Error postId', field: 'postId'});
        res.status(404).json({
            errorsMessages: errors
        })
        return
    }

}

