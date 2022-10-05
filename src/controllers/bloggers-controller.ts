import {PostsService} from "../domain/posts-service";
import {BloggersService} from "../domain/bloggers-service";
import {Request, Response} from "express";
import {injectable} from "inversify";

@injectable()
export class BloggersController {
    constructor(protected bloggersService: BloggersService, protected postsService: PostsService) {
    }

    async getBloggers(req: Request, res: Response) {
        try {
            const page = req.query.pageNumber || 1
            const pageSize = req.query.pageSize || 10
            const name = req.query.SearchNameTerm || null
            const bloggers = await this.bloggersService.getBloggers(+page, +pageSize, name ? name.toString() : null)
            return res.status(200).send(bloggers)
        } catch (error) {
            console.log(error)
            return res.send('Error')
        }
    }

    async getBlogger(req: Request, res: Response) {
        try {
            const blogger = await this.bloggersService.getBlogger(req.params.id)
            if (!blogger) return res.status(404).send('Not found')
            return res.status(200).send(blogger)
        } catch (error) {
            console.log(error)
            return res.send('Error')
        }
    }

    async createBlogger(req: Request, res: Response) {
        try {
            const bloggerName = req.body.name;
            const bloggerYoutubeUrl = req.body.youtubeUrl;
            const newBlogger = await this.bloggersService.createBlogger(bloggerName, bloggerYoutubeUrl);
            if (!newBlogger) return res.status(400).send('incorrect values')
            return res.status(201).send(newBlogger)
        } catch (error) {
            console.log(error)
            return res.send('Error')
        }
    }

    async updateBlogger(req: Request, res: Response) {
        try {
            const updateBlogger = await this.bloggersService.updateBlogger(req.params.id, req.body.name, req.body.youtubeUrl)
            if (updateBlogger) return res.sendStatus(204)
            return res.sendStatus(404)
        } catch (error) {
            console.log(error)
            return res.send('Error')
        }
    }

    async deleteBlogger(req: Request, res: Response) {
        try {
            const isDeleted = await this.bloggersService.deleteBlogger(req.params.id)
            if (isDeleted) return res.sendStatus(204)
            return res.sendStatus(404)
        } catch (error) {
            console.log(error)
            return res.send('Error')
        }
    }

    async getBloggerPosts(req: Request, res: Response) {
        try {
            let page = req.query.PageNumber || 1
            let pageSize = req.query.PageSize || 10
            // console.log('getBloggerPosts', `page: ${page}`, `pageSize: ${pageSize}`)
            const blogId = req.params.id
            const blogger = await this.bloggersService.getBlogger(blogId)
            if (blogger) {
                const bloggerPosts = await this.bloggersService.getBloggerPosts(blogId, +page, +pageSize, req.user)
                return res.status(200).send(bloggerPosts)
            } else {
                const errors = [];
                errors.push({message: 'Error blogId', field: 'blogId'})
                if (errors.length) {
                    res.status(404).json({
                        errorsMessages: errors
                    })
                    return
                }
            }
        } catch (error) {
            console.log(error)
            return res.send('Error')
        }
    }

    async createPostBlogger(req: Request, res: Response) {
        try {
            const blogId = req.params.id;
            const titlePost = req.body.title;
            const shortDescriptionPost = req.body.shortDescription;
            const contentPost = req.body.content;
            const newPostBlogger = await this.postsService.createPost(titlePost, shortDescriptionPost, contentPost, blogId)
            if (!newPostBlogger) {
                const errors = [];
                errors.push({message: 'Error blogId', field: 'blogId'})
                res.status(404).json({
                    errorsMessages: errors
                })
                return
            }
            return res.status(201).send(newPostBlogger)
        } catch (error) {
            console.log(error)
            return res.send('Error')
        }
    }
}