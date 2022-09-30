import {BloggersRepository} from "../repositories/bloggers-repository";
import {BloggerType, BloggerViewType, CreateBloggerDto, PaginationBloggerType} from "../types/bloggersTypes";
import {PaginationBloggerPostType, PaginationPostType} from "../types/postsTypes";
import {ObjectId} from "mongodb";
import {PostsRepository} from "../repositories/posts-repository";
import {injectable} from "inversify";

@injectable()
export class BloggersService {
    constructor(protected bloggersRepository: BloggersRepository, protected postsRepository = PostsRepository) {}

    async getBloggers(page: number, pageSize: number, name: string | null): Promise<PaginationBloggerType> {
        const bloggerData = await this.bloggersRepository.getBloggers(page, pageSize, name)
        const pagesCount = Math.ceil(await this.bloggersRepository.countBlogger(name) / pageSize)
        const totalCount = await this.bloggersRepository.countBlogger(name)
        return {
            "pagesCount": pagesCount,
            "page": page,
            "pageSize": pageSize,
            "totalCount": totalCount,
            "items": bloggerData
            // "items": bloggerData.map(bloggerData => ({
            //     id: bloggerData._id,
            //     name: bloggerData.name,
            //     youtubeUrl: bloggerData.youtubeUrl
            // }))
        }
    }

    async getBlogger(id: string): Promise<BloggerViewType | null> {
        const blogger = await this.bloggersRepository.getBloggerById(id)
        if (!blogger) return null
        return {
            id: blogger._id.toString(),
            name: blogger.name,
            youtubeUrl: blogger.youtubeUrl
        }
    }

    async createBlogger(name: string, youtubeUrl: string): Promise<BloggerViewType | null> {
        const newBlogger: CreateBloggerDto = {
            name: name,
            youtubeUrl: youtubeUrl
        }

        const createdBlogger = await this.bloggersRepository.createBlogger(newBlogger)
        if (createdBlogger) return {
            id: createdBlogger._id.toString(),
            name: createdBlogger.name,
            youtubeUrl: createdBlogger.youtubeUrl
        }
        return null
    }

    async updateBlogger(id: string, name: string, youtubeUrl: string): Promise<boolean> {
        return await this.bloggersRepository.updateBlogger(id, name, youtubeUrl)
    }

    async deleteBlogger(id: string): Promise<boolean> {
        return await this.bloggersRepository.deleteBlogger(id)
    }

    async getBloggerPosts(bloggerId: string, page: number, pageSize: number): Promise<PaginationBloggerPostType> {
        const postData = await this.bloggersRepository.findPostsBlogger(bloggerId, page, pageSize)
        const totalCount = await this.bloggersRepository.countPostBlogger(bloggerId)
        const pagesCount = Math.ceil(await this.bloggersRepository.countPostBlogger(bloggerId) / pageSize)
        return {
            "pagesCount": pagesCount,
            "page": page,
            "pageSize": pageSize,
            "totalCount": totalCount,
            "items": postData
        }
    }
}


