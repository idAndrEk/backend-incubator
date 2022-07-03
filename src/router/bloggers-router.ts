import {Request, Response, Router} from "express";
import {bloggersService} from "../domain/blogegers-servic";
import {allValidation} from "../middlewares/Validation";
import {BloggerValidation} from "../middlewares/Blogger-validation";
import {authMiddleware} from "../middlewares/auth-middleware";
import {ObjectId} from "mongodb";
import {postCollection} from "../repositories/db";
import {postsServise} from "../domain/posts-servise";
import {postsRouter} from "./posts-router";
import {bloggersRepository} from "../repositories/bloggers-db-repository";

export const bloggersRouter = Router({})

bloggersRouter.get('/',
    async (req: Request, res: Response) => {
        let page = req.query.PageNumber || 1
        let pageSize = req.query.PageSize || 10
        let bloggers
        if (page && pageSize) {
            bloggers = await bloggersService.allBloggers(+page, +pageSize)
        }
        res.status(200).send(bloggers)
        return
    })


// bloggersRouter.get('/:name',
//     async (req: Request, res: Response) => {
//         const bloggerName = await bloggersService.findBloggersName(req.params.name)
//         if (!bloggerName) {
//             res.status(404).send('Not found')
//         } else {
//             res.status(404).send(bloggerName)
//         }
//     })

bloggersRouter.get('/:id',
    async (req: Request, res: Response) => {
        const blogger = await bloggersService.findBloggerById(+req.params.id)
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
        console.log(newBlogger)
        res.status(201).send(newBlogger)
    })

bloggersRouter.put('/:id',
    authMiddleware,
    BloggerValidation,
    allValidation,
    async (req: Request, res: Response) => {
        const idBlogger = +req.params.id;
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
        const isDeleted = await bloggersService.deleteBlogger(+req.params.id)
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
        const bloggerId = +req.params.bloggerId
        const isBlogger = await bloggersRepository.findBloggerById(bloggerId)
        if (isBlogger) {
            // if (page && pageSize) {
            const bloggerPosts = await bloggersService.findBloggerPosts(bloggerId, +page, +pageSize)
            res.status(200).send(bloggerPosts)
        } else {
            res.sendStatus(404).send('Not found')
        }
    })

bloggersRouter.post('/:bloggerId/posts',
    async (req: Request, res: Response) => {
        const titlePost = req.body.title;
        const shortDescriptionPost = req.body.shortDescription;
        const contentPost = req.body.content;
        const bloggerId = +req.body.bloggerId;
        const bloggerName = req.body.bloggerName;
        const isBloggerId = await bloggersRepository.findBloggerById(bloggerId);
        if (!isBloggerId) {
            res.status(404).send("test")
            return
        } else {
            const newPostBlogger = await postsServise.createPost(titlePost, shortDescriptionPost, contentPost, bloggerId, bloggerName)
            res.status(201).send(newPostBlogger)
        }
    })





