import {bloggersRepository} from "../repositories/bloggers-db-repository";
import {BloggerType, PaginationBloggerType} from "../types/bloggersTypes";
import {v4 as uuidv4} from "uuid";
import {PaginationPostType} from "../types/postsTypes";

export const bloggersService = {
    async allBloggers(page: number, pageSize: number, name: string | null): Promise<PaginationBloggerType> {
        const bloggerData = await bloggersRepository.allBloggers(page, pageSize, name)
        const pagesCount = Math.ceil(await bloggersRepository.countBlogger(name) / pageSize)
        const totalCount = await bloggersRepository.countBlogger(name)
        return {
            "pagesCount": pagesCount,
            "page": page,
            "pageSize": pageSize,
            "totalCount": totalCount,
            "items": bloggerData
        }
    },

    async findBloggerById(id: string): Promise<BloggerType | null> {
        return bloggersRepository.findBloggerById(id)
    },

    async createBlogger(name: string, youtubeUrl: string): Promise<BloggerType | null> {
        const newBlogger = {
            id: uuidv4(),
            name: name,
            youtubeUrl: youtubeUrl
        }
        const isBloggerCreated = await bloggersRepository.createBlogger(newBlogger)
        if (isBloggerCreated) return newBlogger
        return null
    },

    async updateBlogger(id: string, name: string, youtubeUrl: string): Promise<boolean> {
        return await bloggersRepository.updateBlogger(id, name, youtubeUrl)
    },

    async deleteBlogger(id: string): Promise<boolean> {
        return await bloggersRepository.deleteBlogger(id)
    },

    async findBloggerPosts(bloggerId: string, page: number, pageSize: number): Promise<PaginationPostType> {
        const postData = await bloggersRepository.findPostsBlogger(bloggerId, page, pageSize)
        const totalCount = await bloggersRepository.countPostBlogger(bloggerId)
        const pagesCount = Math.ceil(await bloggersRepository.countPostBlogger(bloggerId) / pageSize)
        return {
            "pagesCount": pagesCount,
            "page": page,
            "pageSize": pageSize,
            "totalCount": totalCount,
            "items": postData
        }
    }

}
