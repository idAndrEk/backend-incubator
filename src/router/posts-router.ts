import {Request, Response, Router} from "express";
import {bloggers} from "../repositories/bloggers-in-memory-repository";
import {postValidation} from "../middlewares/Post-validation";
import {allValidation} from "../middlewares/Validation";
import {authMiddleware} from "../middlewares/auth-middleware";
import {postsServise} from "../domain/posts-servise";

export const postsRouter = Router({})

postsRouter.get('/', async (req: Request, res: Response) => {
    const posts = await postsServise.allPosts()
    res.status(200).send(posts)
})

postsRouter.get('/:id', async (req: Request, res: Response) => {
    const post = await postsServise.findPostsId(+req.params.id)
    if (!post) {
        res.sendStatus(404).send('Not found')
    } else {
        res.json(post)
    }
})

postsRouter.post('/',
    authMiddleware,
    postValidation,
    allValidation,
    async  (req: Request, res: Response) => {
        const blogger = bloggers.find(b => b.id === req.body.bloggerId);
        const errors = []
        if (blogger) {
            const titlePost = req.body.title;
            const shortDescriptionPost = req.body.shortDescription;
            const contentPost = req.body.content;
            const bloggerId = +req.body.bloggerId;
            const bloggerName = blogger.name
            const newPost = await postsServise.createPost(titlePost, shortDescriptionPost, contentPost, bloggerId, bloggerName)
            res.status(201).send(newPost)
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

postsRouter.put('/:id',
    authMiddleware,
    postValidation,
    allValidation,
    async (req: Request, res: Response) => {
        const blogger = bloggers.find(b => b.id === req.body.bloggerId);
        if (blogger) {
            const idPost = +req.params.id;
            const titlePost = req.body.title;
            const shortDescriptionPost = req.body.shortDescription;
            const contentPost = req.body.content;
            const bloggerId = +req.body.bloggerId;
            const updatedPost = await postsServise.updatePost(idPost, titlePost, shortDescriptionPost, contentPost, bloggerId)
            if (!updatedPost) {
                res.sendStatus(404)
                return;
            }
            res.sendStatus(204)
            return
        }
        const errors = [];
        errors.push({message: 'Error bloggerId', field: 'bloggerId'})
        if (errors.length) {
            res.status(400).json({
                errorsMessages: errors
            })
            return
        }
    })

postsRouter.delete('/:id',
    authMiddleware,
    async (req: Request, res: Response) => {
        const idDeletedPost = await postsServise.deletePost(+req.params.id)
        if (idDeletedPost) {
            res.send(204)
        }
        res.send(404)
    })
