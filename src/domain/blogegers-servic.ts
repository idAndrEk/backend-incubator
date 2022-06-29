import {bloggersRepository} from "../repositories/bloggers-db-repository";
import {bloggersType} from "../repositories/db";
import {Request} from "express";

export const bloggersService = {
    async allBloggers(page: number, pageSize: number): Promise<bloggersType[]> {
        return await bloggersRepository.allBloggers(page, pageSize)
    },

    async findBloggersName(name:string): Promise<any> {
        return await bloggersRepository.findBloggersName(name)
    },

    async findBloggersId(id: number): Promise<bloggersType | null> {
        return await bloggersRepository.findBloggersId(id)
    },

    async createBlogger(name: string, youtubeUrl: string): Promise<bloggersType | null> {
        const newBlogger = {
            id: +bloggersRepository.findBloggersId.length + 1, //(new Date()),
            name: name,
            youtubeUrl: youtubeUrl
        }
        const createdBlogger = await bloggersRepository.createBlogger(newBlogger)
        return createdBlogger
    },

    async updateBlogger(id: number, name: string, youtubeUrl: string): Promise<boolean> {
        return await bloggersRepository.updateBlogger(id, name, youtubeUrl)
    },

    async deleteBlogger(id: number): Promise<boolean> {
        return await bloggersRepository.deleteBlogger(id)
    }
}
