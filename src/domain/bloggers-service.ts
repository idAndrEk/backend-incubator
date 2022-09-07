import {bloggersRepository} from "../repositories/bloggers-db-repository";
import {BloggerType, PaginationBloggerType} from "../types/bloggersTypes";
import {v4 as uuidv4} from "uuid";
import {PaginationPostType} from "../types/postsTypes";
import {Schema} from "mongoose";
import { ObjectId } from "mongodb";

export const bloggersService = {
    async allBloggers(page: number, pageSize: number, name: string | null): Promise<PaginationBloggerType> {
        const bloggerData = await bloggersRepository.allBloggers(page, pageSize, name)
        const pagesCount = Math.ceil(await bloggersRepository.countBlogger(name) / pageSize)
        const totalCount = await bloggersRepository.countBlogger(name)
        console.log('BL DATA = ', bloggerData)
        return {
            "pagesCount": pagesCount,
            "page": page,
            "pageSize": pageSize,
            "totalCount": totalCount,
            "items": bloggerData
        }
    },

    async findBloggerById(id: string): Promise<BloggerType | null> {
        const blogger =  await bloggersRepository.findBloggerById(id)
        return  blogger
    },

    async createBlogger(name: string, youtubeUrl: string): Promise<BloggerType | null> {
        const newBlogger = {
            _id: new ObjectId(),
            name: name,
            youtubeUrl: youtubeUrl
        }

        const createdBlogger = await bloggersRepository.createBlogger(newBlogger)
        if (createdBlogger) return createdBlogger
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
