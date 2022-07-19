import {Request, Response, Router} from "express";
import {bloggersService} from "../domain/bloggers-service";
import {allValidation} from "../middlewares/Validation";
import {BloggerValidation} from "../middlewares/Blogger-validation";
import {authMiddleware, checkIdParamMiddleware} from "../middlewares/auth-middleware";
import {postsServise} from "../domain/posts-servise";
import {bloggersRepository} from "../repositories/bloggers-db-repository";
import {postValidation} from "../middlewares/Post-validation";

export const bloggersRouter = Router({})

bloggersRouter.get('/',
    async (req: Request, res: Response) => {
        const page = req.query.PageNumber || 1
        const pageSize = req.query.PageSize || 10
        const name = req.query.SearchNameTerm || null
        // console.log(name)
        const bloggers = await bloggersService.allBloggers(+page, +pageSize, name ? name.toString() : null)
        res.status(200).send(bloggers)
        return
    })

bloggersRouter.get('/:id', checkIdParamMiddleware,
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
            res.status(500).send('something went wrong')
            return
        }
        // console.log(newBlogger)
        res.status(201).send(newBlogger)
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
            res.sendStatus(204)
        } else {
            res.sendStatus(404)
        }
    })

bloggersRouter.delete('/:id',
    authMiddleware,
    async (req: Request, res: Response) => {
        const isDeleted = await bloggersService.deleteBlogger(req.params.id)
        if (isDeleted) {
            res.sendStatus(204)
        } else {
            res.sendStatus(404)
        }
    })

bloggersRouter.get('/:bloggerId/posts',
    async (req: Request, res: Response) => {
        let page = req.query.PageNumber || 1
        let pageSize = req.query.PageSize || 10
        const bloggerId = req.params.bloggerId
        const blogger = await bloggersRepository.findBloggerById(bloggerId)
        if (blogger) {
            const bloggerPosts = await bloggersService.findBloggerPosts(bloggerId, +page, +pageSize)
            res.status(200).send(bloggerPosts)
            return
        } else {
            const errors = [];
            errors.push({message: 'Error bloggerId', field: 'bloggerId'})
            if (errors.length) {
                res.status(400).json({
                    errorsMessages: errors
                })
                return
            }
        }
    })
// })        const blogger = await bloggersRepository.findBloggerById(bloggerId)
//     if (blogger) {
//         const bloggerPosts = await bloggersService.findBloggerPosts(bloggerId, +page, +pageSize)
//         res.status(200).send(bloggerPosts)
//         return
//     }
//     res.status(404).send('Not found')
// })

bloggersRouter.post('/:bloggerId/posts',
    authMiddleware,
    postValidation,
    allValidation,
    async (req: Request, res: Response) => {
        const bloggerId = req.params.bloggerId;
        const titlePost = req.body.title;
        const shortDescriptionPost = req.body.shortDescription;
        const contentPost = req.body.content;
        const newPostBlogger = await postsServise.createPost(
            titlePost,
            shortDescriptionPost,
            contentPost,
            bloggerId,
        )
        if (!newPostBlogger) {
            const errors = [];
            errors.push({message: 'Error bloggerId', field: 'bloggerId'})
            if (errors.length) {
                res.status(400).json({
                    errorsMessages: errors
                })
                return
            }
        }
        res.status(201).send(newPostBlogger)
    })





