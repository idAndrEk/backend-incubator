import {promises} from "dns";
import {bloggersCollection, bloggersType} from "./db";

// export const bloggers = [
//     {id: 1, name: 'IT-KAMASUTRA!', youtubeUrl: 'https://www.youtube.com/c/ITKAMASUTRA'},
//     {id: 2, name: 'webDev', youtubeUrl: 'https://www.youtube.com/c/YauhenKavalchuk'},
//     {id: 3, name: 'Egor Malkevich', youtubeUrl: 'https://www.youtube.com/c/EgorMalkevich'},
//     {id: 4, name: 'Ulbi TV', youtubeUrl: 'https://www.youtube.com/c/UlbiTV'},
// ]

export const bloggersRepository = {
    async allBloggers(): Promise<bloggersType[]> {
        return bloggersCollection.find({}).toArray()
    },

    async findBloggersId(id: number): Promise<bloggersType | null> {
        const blogger: bloggersType | null = await bloggersCollection.findOne({id: id})
        return blogger
    },

    async createBlogger(newBlogger: bloggersType): Promise<bloggersType | undefined> {
        const result = await bloggersCollection.insertOne(newBlogger)
        return newBlogger
    },

    async updateBlogger(id: number, name: string, youtubeUrl: string): Promise<boolean> {
        const result = await bloggersCollection.updateOne({id: id}, {
            $set: {
                name: name,
                youtubeUrl: youtubeUrl
            }
        })
        return result.matchedCount === 1
    },

    async deleteBlogger(id: number): Promise<boolean> {
        const result = await bloggersCollection.deleteOne({id: id})
        return result.deletedCount === 1
    }
}
