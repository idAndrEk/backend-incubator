import {Request, Response, Router} from "express";
import {bloggersServise} from "../domain/blogegers-servis";
import {allValidation} from "../middlewares/Validation";
import {BloggerValidation} from "../middlewares/Blogger-validation";
import {authMiddleware} from "../middlewares/auth-middleware";

export const bloggersRouter = Router({})


bloggersRouter.get('/',
    async (req: Request, res: Response) => {
    const bloggers = await bloggersServise.allBloggers()
        res.status(200).send(bloggers)
})

bloggersRouter.get('/:id',
    async (req: Request, res: Response) => {
        const bloggerId = await bloggersServise.findBloggersId(+req.params.id)
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
        const newBlogger = await bloggersServise.createBlogger(bloggerName, bloggerYoutubeUrl)
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
        const updateBlogger = await bloggersServise.updateBlogger(idBlogger, nameBlogger, youtubeUrlBlogger)
        if (updateBlogger) {
            res.sendStatus(204)
        } else {
            res.sendStatus(404)
        }
    })

bloggersRouter.delete('/:id',
    authMiddleware,
    async (req: Request, res: Response) => {
        const isDeleted = await bloggersServise.deleteBlogger(+req.params.id)
        if (isDeleted) {
            res.sendStatus(204)
        } else {
            res.sendStatus(404)
        }
    })