import {Request, Response, Router} from "express";
import {bloggersRepository} from "../repositories/bloggers-repository";


export const bloggersRouter = Router({})


// bloggersRouter.get('/', (req: Request, res: Response) => {
//     const bloggers = bloggersRepository.getBloggers(bloggers)
//     res.status(200).send(bloggers)
// });

bloggersRouter.get('/:id', (req: Request, res: Response) => {
    const bloggerId = bloggersRepository.findBloggersId(+req.params.id)
    if (!bloggerId) {
        res.status(404).send('Not found')
    } else {
        res.status(200).send(bloggerId)
    }
})

bloggersRouter.post('/', (req: Request, res: Response) => {
    const bloggerName = req.body.name;
    const bloggerYoutubeUrl = req.body.youtubeUrl;
    const newBlogger = bloggersRepository.createBlogger(bloggerName, bloggerYoutubeUrl)
    res.status(201).send(newBlogger)
    })

// bloggersRouter.delete('/:id', (req: Request, res: Response) => {
//     for (let i = 0; i < bloggers.length; i++) {
//         if (bloggers[i].id === +req.params.id) {
//             bloggers.splice(i, 1);
//             res.sendStatus(204)
//             return
//         }
//     }
//     res.sendStatus(404)
// })

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