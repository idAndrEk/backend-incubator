import {Request, Response, Router} from "express";
import {bloggersRepository} from "../repositories/bloggers-repository";
import {nameValidation} from "../middlewares/nameValidation";
import {shema} from "../middlewares/register-shema";

export const bloggersRouter = Router({})


bloggersRouter.get('/', (req: Request, res: Response) => {
    const bloggers = bloggersRepository.allBloggers()
    res.status(200).send(bloggers)
});

bloggersRouter.get('/:id', (req: Request, res: Response) => {
    const bloggerId = bloggersRepository.findBloggersId(+req.params.id)
    if (!bloggerId) {
        res.status(404).send('Not found')
    } else {
        res.status(200).send(bloggerId)
    }
})

bloggersRouter.post('/',
    shema,
    nameValidation,
    (req: Request, res: Response) => {
    const bloggerName = req.body.name;
    const bloggerYoutubeUrl = req.body.youtubeUrl;
    const newBlogger = bloggersRepository.createBlogger(bloggerName, bloggerYoutubeUrl)
    res.status(201).send(newBlogger)
    })

bloggersRouter.put('/:id', (req: Request, res: Response) => {
    const idBlogger = +req.params.id;
    const nameBlogger = req.body.name;
    const youtubeUrlBlogger = req.body.youtubeUrl;
    const updateBlogger = bloggersRepository.updateBlogger(idBlogger, nameBlogger, youtubeUrlBlogger)
    if (updateBlogger) {
        res.sendStatus(204)
        } else {
        res.sendStatus(404)
        }
})

bloggersRouter.delete('/:id', (req: Request, res: Response) => {
    const isDeleted = bloggersRepository.deleteBlogger(+req.params.id)
    if(isDeleted) {
        res.sendStatus(204)
    } else {
        res.sendStatus(404)
    }
})