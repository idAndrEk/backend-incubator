import {Request, Response, Router} from "express";
import {postValidation} from "../middlewares/Post-validation";
import {allValidation} from "../middlewares/ValidationError";
import {authMiddleware, authMiddlewareUser,} from "../middlewares/auth-middleware";
import {postsService} from "../domain/posts-service";
import {bloggersRepository} from "../repositories/bloggers-repository";
import {postsRepositories} from "../repositories/posts-repository";
import {commentsService} from "../domain/comments-service";
import {commentValidation} from "../middlewares/comments-validation";
import {checkIdParamMiddleware} from "../middlewares/checkIdParam-Middleware";

export const postsRouter = Router({})

postsRouter.get('/',
    async (req: Request, res: Response) => {
        const page = req.query.PageNumber || 1
        const pageSize = req.query.PageSize || 10
        const posts = await postsService.allPosts(+page, +pageSize)
        return res.status(200).send(posts)
    })

postsRouter.get('/:id',
    checkIdParamMiddleware,
    async (req: Request, res: Response) => {
        const post = await postsService.findPostsId(req.params.id);
        if (!post) {
            res.status(404).send('Not found')
        } else {
            res.status(200).send(post)
        }
    })

postsRouter.post('/',
    authMiddleware,
    postValidation,
    allValidation,
    async (req: Request, res: Response) => {
        const titlePost = req.body.title;
        const shortDescriptionPost = req.body.shortDescription;
        const contentPost = req.body.content;
        const bloggerId = req.body.bloggerId;
        const newPost = await postsService.createPost(titlePost, shortDescriptionPost, contentPost, bloggerId)
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
    })

postsRouter.put('/:id',
    checkIdParamMiddleware,
    authMiddleware,
    postValidation,
    allValidation,
    async (req: Request, res: Response) => {
        const blogger = await bloggersRepository.getBloggerById(req.body.bloggerId);
        if (blogger) {
            const idPost = req.params.id;
            const titlePost = req.body.title;
            const shortDescriptionPost = req.body.shortDescription;
            const contentPost = req.body.content;
            const bloggerId = req.body.bloggerId;
            const result = await postsService.updatePost(idPost, titlePost, shortDescriptionPost, contentPost, bloggerId)
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
    })

postsRouter.delete('/:id',
    checkIdParamMiddleware,
    authMiddleware,
    async (req: Request, res: Response) => {
        const idDeletedPost = await postsService.deletePost(req.params.id)
        if (idDeletedPost) {
            res.sendStatus(204)
        } else {
            res.sendStatus(404)
        }
    })

postsRouter.get('/:id/comments',
    checkIdParamMiddleware,
    async (req: Request, res: Response) => {
        let page = req.query.PageNumber || 1
        let pageSize = req.query.PageSize || 10
        const postId = req.params.id
        const post = await postsRepositories.findPostsId(postId)
        if (post) {
            const postComment = await postsService.findPostComment(postId, +page, +pageSize)
            return res.status(200).send(postComment)
        } else {
            const errors = [];
            errors.push({message: 'Error postId', field: 'postId'})
            res.status(404).json({
                errorsMessages: errors
            })
            return
        }
    })

postsRouter.post('/:id/comments',
    checkIdParamMiddleware,
    authMiddlewareUser,
    commentValidation,
    allValidation,
    async (req: Request, res: Response) => {
        const postId = req.params.id;
        const content = req.body.content;
        const userLogin = req.user?.login as string;
        const userId = req.user?.id as string;
        const post = await postsRepositories.findPostsId(postId);
        if (post) {
            const newCommentPost = await commentsService.createComment(content, userId, userLogin, postId)
            res.status(201).send(newCommentPost)
        } else {
            const errors = [];
            errors.push({message: 'Error postId', field: 'postId'});
            res.status(404).json({
                errorsMessages: errors
            })
            return
        }
    })