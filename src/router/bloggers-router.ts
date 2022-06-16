import {Request, Response, Router} from "express";
import {bloggersRepository} from "../repositories/bloggers-repository";


export const bloggersRouter = Router({})


bloggersRouter.get('/', (req: Request, res: Response) => {
    const bloggers = bloggersRepository.!!!
    res.send(bloggers).sendStatus(200)
});
bloggersRouter.get('/:id', (req: Request, res: Response) => {
    const id = +req.params.bloggerId;
    const blogger = bloggers.find(b => b.id === id)
    if (!blogger) {
        res.sendStatus(404).send('Not found')
    } else {
        res.json(blogger).sendStatus(200)
    }
})
bloggersRouter.post('/', (req: Request, res: Response) => {
    const bloggerName = req.body.name;
    const bloggerYoutubeUrl = req.body.youtubeUrl;
    const newBlogger = {id: +(new Date()), name: `${bloggerName}`, youtubeUrl: `${bloggerYoutubeUrl}`}
    const reges = RegExp('^https:\/\/([a-zA-Z0-9_-]+\.)+[a-zA-Z0-9_-]+(\/[a-zA-Z0-9_-]+)*\/?$');
    const errors = [];
    if (typeof bloggerName !== "string" || bloggerName.length > 15 || !bloggerName || bloggerName.trim() === "" ) {
        errors.push({message: 'Error name', field: 'name'})
    }
    if (bloggerYoutubeUrl.length > 100 || typeof bloggerYoutubeUrl !== "string" || !bloggerYoutubeUrl || bloggerYoutubeUrl.trim() === "" || !bloggerYoutubeUrl.match(reges)) {
        errors.push({message: 'Error youtubeUrl', field: 'youtubeUrl'})
    }
    if (errors.length) {
        res.status(400).json({
            errorsMessages: errors
        })
    } else {
        bloggers.push(newBlogger)
        res.status(201).send(newBlogger)
    }
})
bloggersRouter.delete('/:id', (req: Request, res: Response) => {
    for (let i = 0; i < bloggers.length; i++) {
        if (bloggers[i].id === +req.params.id) {
            bloggers.splice(i, 1);
            res.sendStatus(204)
            return
        }
    }
    res.sendStatus(404)
})
bloggersRouter.put('/:id', (req: Request, res: Response) => {
    const nameBlogger = req.body.name;
    const youtubeUrlBlogger = req.body.youtubeUrl;
    const reges = RegExp('^https:\/\/([a-zA-Z0-9_-]+\.)+[a-zA-Z0-9_-]+(\/[a-zA-Z0-9_-]+)*\/?$');
    const errors = [];
    if (typeof nameBlogger !== "string" || nameBlogger.length > 15 || !nameBlogger || nameBlogger.trim() === "" ) {
        errors.push({message: 'Error name', field: 'name'})
    }
    if (youtubeUrlBlogger.length > 100 || typeof youtubeUrlBlogger !== "string" || !youtubeUrlBlogger || youtubeUrlBlogger.trim() === "" || !youtubeUrlBlogger.match(reges)) {
        errors.push({message: 'Error youtubeUrl', field: 'youtubeUrl'})
    }
    if (errors.length) {
        res.status(400).json({
            errorsMessages: errors
        })
    } else {
        const upBlogger = bloggers.find(b => b.id === +(req.params.bloggerId))
        if (upBlogger) {
            upBlogger.name = req.body.name
            upBlogger.youtubeUrl = req.body.youtubeUrl
            res.sendStatus(204)
        } else {
            res.sendStatus(404)
        }
    }
})