import {Request, Response, Router} from "express";
import {postsRepositories} from "../repositories/posts-repository";
import {bloggers} from "../repositories/bloggers-repository";
import {postValidation} from "../middlewares/Post-validation";
import {allValidation} from "../middlewares/Validation";
import {validationResult} from "express-validator";
export const postsRouter = Router({})

postsRouter.get('/', (req: Request, res: Response) => {
    const posts = postsRepositories.allPosts()
    res.status(200).send(posts)
})

postsRouter.get('/:id', (req: Request, res: Response) => {
    const post = postsRepositories.findPostsId(+req.params.id)
    if (!post) {
        res.sendStatus(404).send('Not found')
    } else {
        res.json(post)
    }
})

postsRouter.post('/',
    postValidation,
    allValidation,
    (req: Request, res: Response) => {
    const blogger = bloggers.find(b => b.id === req.body.bloggerId);
    const errors = []
    if (blogger) {
        const titlePost = req.body.title;
        const shortDescriptionPost = req.body.shortDescription;
        const contentPost = req.body.content;
        const bloggerId = +req.body.bloggerId;
        const bloggerName = blogger.name
        const newPost = postsRepositories.createPost(titlePost, shortDescriptionPost, contentPost, bloggerId, bloggerName)
        res.status(201).send(newPost)
    } else {
        res.status(400).send({
            message: 'Error bloggerId',
            field: 'bloggerId'
        })
    }
})

postsRouter.put('/:id',
    postValidation,
    allValidation,
    (req: Request, res: Response) => {
    const blogger = bloggers.find(b => b.id === req.body.bloggerId);
    if (blogger) {
    const idPost = +req.params.id;
    const titlePost = req.body.title;
    const shortDescriptionPost = req.body.shortDescription;
    const contentPost = req.body.content;
    const bloggerId = +req.body.bloggerId;
    const updatePost = postsRepositories.updatePost(idPost, titlePost, shortDescriptionPost, contentPost, bloggerId)
        res.sendStatus(204)
        } else {
        res.status(400).send({
            message: 'Error bloggerId',
            field: 'bloggerId'
        })
    }
})

postsRouter.delete('/:id', (req: Request, res: Response) => {
    const idDeletedPost = postsRepositories.deletePost(+req.params.id)
    if (idDeletedPost) {
        res.send(204)
    }
    res.send(404)
})
