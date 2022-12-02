import {PostsService} from "../domain/posts-service";
import {BlogsService} from "../domain/blogs.service";
import {Request, Response} from "express";
import {injectable} from "inversify";
import {SortDirection} from "../types/paginationType";
import {BlogsQueryRepository} from "../repositories/blogs/blogsQueryRepository";
import {PostsQueryRepository} from "../repositories/posts/postsQueryRepository";

@injectable()
export class BlogsController {
    constructor(protected blogsService: BlogsService,
                protected postsService: PostsService,
                protected blogsQueryRepository: BlogsQueryRepository,
                protected postsQueryRepository: PostsQueryRepository) {}

    async getBlogs(req: Request, res: Response) {
        try {
            const page = req.query.pageNumber || 1
            const pageSize = req.query.pageSize || 10
            let sortBy = req.query.sortBy ?? "createdAt"
            let sortDirection: SortDirection = req.query.sortDirection === 'asc' ? SortDirection.Asc : SortDirection.Desc
            const searchNameTerm = req.query.SearchNameTerm || null
            const getBlogs = await this.blogsQueryRepository.getBlogs(+page, +pageSize, searchNameTerm ? searchNameTerm.toString() : null, sortBy.toString(), sortDirection)
            return res.status(200).send(getBlogs)
        } catch (error) {
            console.log(error)
            return res.send('Error')
        }
    }

    async getBlog(req: Request, res: Response) {
        try {
            const blogger = await this.blogsQueryRepository.getBlog(req.params.id)
            if (!blogger) return res.status(404).send('Not found')
            return res.status(200).send(blogger)
        } catch (error) {
            console.log(error)
            return res.send('Error')
        }
    }

    async createBlogger(req: Request, res: Response) {
        try {
            const blogName = req.body.name;
            const blogDescription = req.body.description
            const blogWebsiteUrl = req.body.websiteUrl;
            const newBlogger = await this.blogsService.createBlog(blogName, blogDescription, blogWebsiteUrl);
            if (!newBlogger) return res.status(400).send('incorrect values')
            return res.status(201).send(newBlogger)
        } catch (error) {
            console.log(error)
            return res.send('Error')
        }
    }

    async updateBlogger(req: Request, res: Response) {
        try {
            const updateBlogger = await this.blogsService.updateBlog(req.params.id, req.body.name,req.body.description,  req.body.youtubeUrl)
            if (updateBlogger) return res.sendStatus(204)
            return res.sendStatus(404)
        } catch (error) {
            console.log(error)
            return res.send('Error')
        }
    }

    async deleteBlogger(req: Request, res: Response) {
        try {
            const isDeleted = await this.blogsService.deleteBlog(req.params.id)
            if (isDeleted) return res.sendStatus(204)
            return res.sendStatus(404)
        } catch (error) {
            console.log(error)
            return res.send('Error')
        }
    }

    async getBloggerPosts(req: Request, res: Response) {
        try {
            const page = req.query.pageNumber || 1
            const pageSize = req.query.pageSize || 10
            // console.log('getBloggerPosts', `page: ${page}`, `pageSize: ${pageSize}`)
            const blogId = req.params.id
            const blogger = await this.blogsQueryRepository.getBlog(blogId)
            if (blogger) {
                const bloggerPosts = await this.postsQueryRepository.findPostsBlogger(blogId, +page, +pageSize, req.user)
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