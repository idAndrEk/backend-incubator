import {PostsService} from "../domain/posts-service";
import {BloggersService} from "../domain/bloggers-service";
import {Request, Response} from "express";
import {injectable} from "inversify";

@injectable()
export class BloggersController {
    constructor(protected bloggersService: BloggersService, protected postsService: PostsService) {}

    async getBloggers(req: Request, res: Response) {
        const page = req.query.PageNumber || 1
        const pageSize = req.query.PageSize || 10
        const name = req.query.SearchNameTerm || null
        const bloggers = await this.bloggersService.getBloggers(+page, +pageSize, name ? name.toString() : null)
        return res.status(200).send(bloggers)
    }

    async getBlogger(req: Request, res: Response) {
        const blogger = await this.bloggersService.getBlogger(req.params.id)
        if (!blogger) {
            res.status(404).send('Not found')
        } else {
            res.status(200).send(blogger)
        }
    }

    async createBlogger(req: Request, res: Response) {
        const bloggerName = req.body.name;
        const bloggerYoutubeUrl = req.body.youtubeUrl;
        const newBlogger = await this.bloggersService.createBlogger(bloggerName, bloggerYoutubeUrl);
        if (!newBlogger) {
            return res.status(500).send('something went wrong')
        }
        return res.status(201).send(newBlogger)
    }

    async updateBlogger(req: Request, res: Response) {
        // const idBlogger = req.params.id;
        // const nameBlogger = req.body.name;
        // const youtubeUrlBlogger = req.body.youtubeUrl;
        const updateBlogger = await this.bloggersService.updateBlogger(req.params.id, req.body.name, req.body.youtubeUrl)
        console.log(updateBlogger)
        if (updateBlogger) {
            return res.sendStatus(204)
        } else {
            return res.sendStatus(404)
        }
    }

    async deleteBlogger(req: Request, res: Response) {
        const isDeleted = await this.bloggersService.deleteBlogger(req.params.id)
        if (isDeleted) {
            return res.sendStatus(204)
        } else {
            return res.sendStatus(404)
        }
    }

    async getBloggerPosts(req: Request, res: Response) {
      try {
          let page = req.query.PageNumber || 1
          let pageSize = req.query.PageSize || 10
          console.log('getBloggerPosts', `page: ${page}`, `pageSize: ${pageSize}`)
          const bloggerId = req.params.id
          const blogger = await this.bloggersService.getBlogger(bloggerId)
          if (blogger) {
              const bloggerPosts = await this.bloggersService.getBloggerPosts(bloggerId, +page, +pageSize, req.user)
              return res.status(200).send(bloggerPosts)
          } else {
              const errors = [];
              errors.push({message: 'Error bloggerId', field: 'bloggerId'})
              if (errors.length) {
                  res.status(404).json({
                      errorsMessages: errors
                  })
                  return
              }
          }
      } catch (error) {
          console.log(error)
          return res.status(500).send('ERROR')
      }
    }

    async createPostBlogger(req: Request, res: Response) {
        const bloggerId = req.params.id;
        const titlePost = req.body.title;
        const shortDescriptionPost = req.body.shortDescription;
        const contentPost = req.body.content;
        const newPostBlogger = await this.postsService.createPost(
            titlePost,
            shortDescriptionPost,
            contentPost,
            bloggerId,
        )
        if (!newPostBlogger) {
            const errors = [];
            errors.push({message: 'Error bloggerId', field: 'bloggerId'})
            res.status(404).json({
                errorsMessages: errors
            })
            return
        }
        return res.status(201).send(newPostBlogger)
    }
}