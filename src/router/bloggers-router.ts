import {Request, Response, Router} from "express";
import {bloggersService} from "../domain/blogegers-servic";
import {allValidation} from "../middlewares/Validation";
import {BloggerValidation} from "../middlewares/Blogger-validation";
import {authMiddleware} from "../middlewares/auth-middleware";

export const bloggersRouter = Router({})

bloggersRouter.get('/',
    async (req: Request, res: Response) => {
        let page = req.query.pageNumber
        let pageSize = req.query.pageSize
        let bloggers
        if(page && pageSize){
            bloggers = await bloggersService.allBloggers(+page, +pageSize)
        }
        res.status(200).send(bloggers)
    })

bloggersRouter.get('/:id',
    async (req: Request, res: Response) => {
        const bloggerId = await bloggersService.findBloggersId(+req.params.id)
        if (!bloggerId) {
            res.status(404).send('Not found')
        } else {
            res.status(200).send(bloggerId)
        }
    })

bloggersRouter.post('/',
    authMiddleware,
    BloggerValidation,
    allValidation,
    async (req: Request, res: Response) => {
        const bloggerName = req.body.name;
        const bloggerYoutubeUrl = req.body.youtubeUrl;
        const newBlogger = await bloggersService.createBlogger(bloggerName, bloggerYoutubeUrl)
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





