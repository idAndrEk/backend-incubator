import {Request, Response, Router} from "express";
import {bloggersService} from "../domain/bloggers-service";
import {allValidation} from "../middlewares/Validation";
import {BloggerValidation} from "../middlewares/Blogger-validation";
import {authMiddleware} from "../middlewares/auth-middleware";
import {postsService} from "../domain/posts-service";
import {bloggersRepository} from "../repositories/bloggers-db-repository";
import {postValidation} from "../middlewares/Post-validation";

export const bloggersRouter = Router({})

bloggersRouter.get('/',
    async (req: Request, res: Response) => {
        const page = req.query.PageNumber || 1
        const pageSize = req.query.PageSize || 10
        const name = req.query.SearchNameTerm || null
        const bloggers = await bloggersService.allBloggers(+page, +pageSize, name ? name.toString() : null)
        return res.status(200).send(bloggers)
    })

bloggersRouter.get('/:id',
    async (req: Request, res: Response) => {
        const blogger = await bloggersService.findBloggerById(req.params.id)
        if (!blogger) {
            res.status(404).send('Not found')
        } else {
            res.status(200).send(blogger)
        }
    })

bloggersRouter.post('/',
    authMiddleware,
    BloggerValidation,
    allValidation,
    async (req: Request, res: Response) => {
        const bloggerName = req.body.name;
        const bloggerYoutubeUrl = req.body.youtubeUrl;
        const newBlogger = await bloggersService.createBlogger(bloggerName, bloggerYoutubeUrl);
        if (!newBlogger) {
            return res.status(500).send('something went wrong')
        }
        return res.status(201).send(newBlogger)
    })

bloggersRouter.put('/:id',
    authMiddleware,
    BloggerValidation,
    allValidation,
    async (req: Request, res: Response) => {
        const idBlogger = req.params.id;
        const nameBlogger = req.body.name;
        const youtubeUrlBlogger = req.body.youtubeUrl;
        const updateBlogger = await bloggersService.updateBlogger(idBlogger, nameBlogger, youtubeUrlBlogger)
        if (updateBlogger) {
            return res.sendStatus(204)
        } else {
            return res.sendStatus(404)
        }
    })

bloggersRouter.delete('/:id',
    authMiddleware,
    async (req: Request, res: Response) => {
        const isDeleted = await bloggersService.deleteBlogger(req.params.id)
        if (isDeleted) {
            return res.sendStatus(204)
        } else {
            return res.sendStatus(404)
        }
    })

bloggersRouter.get('/:id/posts',
    async (req: Request, res: Response) => {
        let page = req.query.PageNumber || 1
        let pageSize = req.query.PageSize || 10
        const bloggerId = req.params.id
        const blogger = await bloggersRepository.findBloggerById(bloggerId)
        if (blogger) {
            const bloggerPosts = await bloggersService.findBloggerPosts(bloggerId, +page, +pageSize)
            return res.status(200).send(bloggerPosts)
        } else {
            const errors = [];
            errors.push({message: 'Error bloggerId', field: 'bloggerId'})
            if (errors.length) {
                res.status(404).json({
                    errorsMessages: errors
                })
                return
            }
        }
    })

bloggersRouter.post('/:id/posts',
    authMiddleware,
    postValidation,
    allValidation,
    async (req: Request, res: Response) => {
        const bloggerId = req.params.id;
        const titlePost = req.body.title;
        const shortDescriptionPost = req.body.shortDescription;
        const contentPost = req.body.content;
        const newPostBlogger = await postsService.createPost(
            titlePost,
            shortDescriptionPost,
            contentPost,
            bloggerId,
        )
        if (!newPostBlogger) {
            const errors = [];
            errors.push({message: 'Error bloggerId', field: 'bloggerId'})
            res.status(404).json({
                errorsMessages: errors
            })
            return
        }
        return res.status(201).send(newPostBlogger)
    })





