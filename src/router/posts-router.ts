import {Request, Response, Router} from "express";
import {postValidation} from "../middlewares/Post-validation";
import {allValidation} from "../middlewares/Validation";
import {authMiddleware} from "../middlewares/auth-middleware";
import {postsServise} from "../domain/posts-servise";
import {bloggersRepository} from "../repositories/bloggers-db-repository";

export const postsRouter = Router({})

postsRouter.get('/',
    async (req: Request, res: Response) => {
        let page = req.query.PageNumber || 1
        let pageSize = req.query.PageSize || 10
        let posts
        if (page && pageSize) {
            posts = await postsServise.allPosts(+page, +pageSize)
        }
        res.status(200).send(posts)
        return
    })

postsRouter.get('/:id',
    async (req: Request, res: Response) => {
        // const post = await postsServise.findPostsId(new ObjectId(req.params.id));
        const post = await postsServise.findPostsId(+req.params.id);
        if (!post) {
            res.status(404).send('Not found')
        } else {
            res.status(200).send(post)
        }
    })

postsRouter.post('/',
    authMiddleware,
    postValidation,
    allValidation,
    async (req: Request, res: Response) => {
        // console.log('ROUTER')
        const blogger = await bloggersRepository.findBloggerById(+req.body.bloggerId);
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
        const blogger = await bloggersRepository.findBloggerById(req.body.bloggerId);
        if (blogger) {
            const idPost = +req.params.id;
            const titlePost = req.body.title;
            const shortDescriptionPost = req.body.shortDescription;
            const contentPost = req.body.content;
            const bloggerId = +req.body.bloggerId;
            const result = await postsServise.updatePost(idPost, titlePost, shortDescriptionPost, contentPost, bloggerId)
            if (result) {
                res.sendStatus(204)
                return;
            }
            res.sendStatus(404)
            return
        }
        const errors = [];
        errors.push({message: 'Error bloggerId', field: 'bloggerId'})
        if (errors.length) {
            res.status(400).json({
                errorsMessages: errors
            })
            // return
        }
    })

postsRouter.delete('/:id',
    authMiddleware,
    async (req: Request, res: Response) => {
        const idDeletedPost = await postsServise.deletePost(+req.params.id)
        if (idDeletedPost) {
            res.sendStatus(204)
        } else {
            res.sendStatus(404)
        }
    })
