import {Request, Response, Router} from "express";
import {postValidation} from "../middlewares/Post-validation";
import {allValidation} from "../middlewares/Validation";
import {
    authMiddleware,
    authMiddlewareUser,
    checkIdParamMiddleware,
} from "../middlewares/auth-middleware";
import {postsServise} from "../domain/posts-servise";
import {bloggersRepository} from "../repositories/bloggers-db-repository";
import {postsRepositories} from "../repositories/posts-db-repository";
import {commentsService} from "../domain/comments-service";
import {usersRepository} from "../repositories/users-repository";
import {commentValidation} from "../middlewares/comments-validation";

export const postsRouter = Router({})

postsRouter.get('/',
    async (req: Request, res: Response) => {
        let page = req.query.PageNumber || 1
        let pageSize = req.query.PageSize || 10
        let posts
        if (page && pageSize) {
            posts = await postsServise.allPosts(+page, +pageSize)
        }
        res.status(200).send(posts)
        return
    })

postsRouter.get('/:id',
    checkIdParamMiddleware,
    async (req: Request, res: Response) => {
        const post = await postsServise.findPostsId(req.params.id);
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
        // console.log('ROUTER')

        const titlePost = req.body.title;
        const shortDescriptionPost = req.body.shortDescription;
        const contentPost = req.body.content;
        const bloggerId = req.body.bloggerId;
        const newPost = await postsServise.createPost(titlePost, shortDescriptionPost, contentPost, bloggerId)
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
        res.status(201).send(newPost)
    })

postsRouter.put('/:id',
    authMiddleware,
    postValidation,
    allValidation,
    checkIdParamMiddleware,
    async (req: Request, res: Response) => {
        const blogger = await bloggersRepository.findBloggerById(req.body.bloggerId);
        if (blogger) {
            const idPost = req.params.id;
            const titlePost = req.body.title;
            const shortDescriptionPost = req.body.shortDescription;
            const contentPost = req.body.content;
            const bloggerId = req.body.bloggerId;
            const result = await postsServise.updatePost(idPost, titlePost, shortDescriptionPost, contentPost, bloggerId)
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
            // return
        }
    })

postsRouter.delete('/:id',
    authMiddleware,
    checkIdParamMiddleware,
    async (req: Request, res: Response) => {
        const idDeletedPost = await postsServise.deletePost(req.params.id)
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
        const id = req.params.id
        const post = await postsRepositories.findPostsId(id)
        if (post) {
            const postComment = await postsServise.findPostComment(id, +page, +pageSize)
            res.status(200).send(postComment)
            return
        }
        res.status(404).send('Not found')
    })

postsRouter.post('/:id/comments',
    checkIdParamMiddleware,
    authMiddlewareUser,
    commentValidation,
    async (req: Request, res: Response) => {
        const id = req.params.id;
        const content = req.body.content;
        const userId = req.body.userId;
        const userLogin = req.body.userLogin
        const post = await postsRepositories.findPostsId(id)
        if (post) {
            const newCommentPost = await commentsService.createComment(content, userId, userLogin)
            res.status(200).send(newCommentPost)
        } else {
            const errors = [];
            errors.push({message: 'Error postId', field: 'postId'})
            if (errors.length) {
                res.status(400).json({
                    errorsMessages: errors
                })
                return
            }
        }
    })