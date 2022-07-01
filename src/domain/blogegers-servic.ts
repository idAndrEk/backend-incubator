import {bloggersRepository} from "../repositories/bloggers-db-repository";
import {bloggersType} from "../repositories/db";
import {ObjectId} from "mongodb";

export const bloggersService = {
    async allBloggers(page: number, pageSize: number): Promise<bloggersType[]> {
        return await bloggersRepository.allBloggers(page, pageSize)
    },

    async findBloggersName(name:string): Promise<any> {
        return await bloggersRepository.findBloggersName(name)
    },

    async findBloggersId(id: ObjectId): Promise<bloggersType | null> {
        return await bloggersRepository.findBloggersId(id)
    },

    async createBlogger(name: string, youtubeUrl: string): Promise<bloggersType | null> {
        const newBlogger = {
            id: new ObjectId(),  //+(new Date()), // +bloggersRepository.findBloggersId.length + 1,
            name: name,
            youtubeUrl: youtubeUrl
        }
        const createdBlogger = await bloggersRepository.createBlogger(newBlogger)
        if (createdBlogger) {
            return {
                name: newBlogger.name,
                youtubeUrl: newBlogger.youtubeUrl,
                id: newBlogger.id
            }
        }
        return null
    },

    async updateBlogger(id: ObjectId, name: string, youtubeUrl: string): Promise<boolean> {
        return await bloggersRepository.updateBlogger(id, name, youtubeUrl)
    },

    async deleteBlogger(id: ObjectId): Promise<boolean> {
        return await bloggersRepository.deleteBlogger(id)
    }
}
