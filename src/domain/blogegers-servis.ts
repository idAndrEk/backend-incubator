import {bloggersRepository} from "../repositories/bloggers-db-repository";
import {bloggersType} from "../repositories/db";

export const bloggersServise = {
    async allBloggers(): Promise<bloggersType[]> {
        return bloggersRepository.allBloggers()
    },

    async findBloggersId(id: number): Promise<bloggersType | null> {
        return bloggersRepository.findBloggersId(id)
    },

    async createBlogger(name: string, youtubeUrl: string): Promise<bloggersType | undefined> {
        const newBlogger = {
            id: +(new Date()),
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
