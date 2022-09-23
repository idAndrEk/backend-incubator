import {CommentsService} from "../domain/comments-service";
import {PostsService} from "../domain/posts-service";
import {BloggersService} from "../domain/bloggers-service";
import {Request, Response} from "express";
import {injectable} from "inversify";
import {jwtService} from "../composition-root";

@injectable()
export class PostsController {
    constructor(protected postsService: PostsService, protected bloggersService: BloggersService, protected commentsService: CommentsService) {
    }

    async getPosts(req: Request, res: Response) {
        const page = req.query.PageNumber || 1
        const pageSize = req.query.PageSize || 10
        const posts = await this.postsService.getPosts(+page, +pageSize)
        return res.status(200).send(posts)
    }

    async getPost(req: Request, res: Response) {
        const post = await this.postsService.getPost(req.params.id);
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
        const blogger = await this.bloggersService.getBloggerById(req.body.bloggerId);
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

    // async updateLike(req: Request, res: Response) {
    //     const post = await this.postsService.getPost(req.params.id);
    //     if (!post) return res.sendStatus(404)
    //     const postId = req.params.id;
    //     const {likeStatus} = req.body;
    //     await this.postsService.updateLike(postId, likeStatus);
    //     return res.sendStatus(204)
    // }

    async addLikeToPost(req: Request<{ id: string }, never, { likeStatus: string }, never>, res: Response) {
        try {
            const post = await this.postsService.getPost(req.params.id);
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

    // totalaction[] userId, data, likestatus // if (pull/push) method MAP

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
        const post = await this.postsService.getPost(postId)
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
        const postId = req.params.id;
        const content = req.body.content;
        const userLogin = req.user?.login as string;
        const userId = req.user?.id as string;
        const post = await this.postsService.getPost(postId);
        if (post) {
            const newCommentPost = await this.commentsService.createComment(content, userId, userLogin, postId)
            res.status(201).send(newCommentPost)
        } else {
            const errors = [];
            errors.push({message: 'Error postId', field: 'postId'});
            res.status(404).json({
                errorsMessages: errors
            })
            return
        }
    }
}

