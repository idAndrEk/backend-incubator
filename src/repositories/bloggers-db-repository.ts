import {promises} from "dns";
import {bloggersCollection} from "./db";
import {ObjectId} from "mongodb";
import {BloggerPayloadType, BloggersResponseType, PaginationType} from "../types/bloggersTypes";

export const bloggersRepository = {
    async allBloggers(page: number, pageSize: number, name?: string): Promise<PaginationType<BloggersResponseType>> {
        let filter = {}

        if(name) {
            filter = {$regexp: {name}}
        }

        const skip = (page - 1) * pageSize
        let allBloggersCount = await bloggersCollection.countDocuments()
        let pagesCount = allBloggersCount / pageSize
        let bloggers = await bloggersCollection.find(filter).skip(skip).limit(pageSize).toArray()
        let allCount = await bloggersCollection.count(filter)
        return {
            pagesCount: Math.ceil(pagesCount),
             page: page,
             pageSize: pageSize,
             totalCount: allCount,
            items: bloggers.map(blogger => ({
                youtubeUrl: blogger.youtubeUrl,
                // id: blogger._id.toString(),
                id: blogger.id,
                name: blogger.name
            }))
        }
    },

    async findBloggersName(name: string | null)/*: Promise<BloggersType | null>*/ {
        const filter = {} as { name: { $regex: string } }
        if (name) {
            filter.name = {$regex: name}
            return await bloggersCollection.findOne(filter)
        }
    }
    ,

    async findBloggerById(id: string): Promise<BloggersResponseType | null> {
        const blogger = await bloggersCollection.findOne({ _id: new ObjectId(id) });
        
        if(!blogger) {
            return null
        }
        
        // return {id: blogger._id.toString(), name: blogger.name, youtubeUrl: blogger.youtubeUrl}
        return {id: blogger.id, name: blogger.name, youtubeUrl: blogger.youtubeUrl}
    },

    // async createBlogger(newBlogger: BloggerPayloadType): Promise<BloggersResponseType | null> {
    async createBlogger(newBlogger: BloggersResponseType): Promise<BloggersResponseType | null> {
        const { youtubeUrl, name } = newBlogger
        const result = await bloggersCollection.insertOne(newBlogger);
        
        if(!result.acknowledged) {
            return null
        }
        
        return {
            name,
            youtubeUrl,
            // id: result.insertedId.toString()
            id: newBlogger.id
        }
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

// async function getQuery() {
//     let query = await db.collection.find({}).skip(5).limit(5);
//     let countTotal = await query.count()
//     let countWithConstraints = await query.count(true)
//     return { query, countTotal }
// }
//
// const page = parseInt(req.query.page);
// const userService = new userService();
// const users = await userService.getAll(page);
// getAll(page = 1) {
//     const PAGE_SIZE = 20;
//     const skip = (page - 1) * PAGE_SIZE;
//     return UsersModel.aggregate([
//         { $match: {} },
//         { $skip: (page - 1) * PAGE_SIZE },
//         { $limit: PAGE_SIZE },
//     ])
// }


// async allBloggers(page: number, pageSize: number, filter: object, idBlogger?: object): Promise<any> {
//     let idBloggerObj = {
//         projection: {
//             _id: false,
//             ...idBlogger
//         }
//     }
//     const skip = (page - 1) * pageSize
//     let allBloggers = await bloggersCollection.find({}).toArray()
//     let pagesCount = allBloggers.length / pageSize
//     let bloggers = await bloggersCollection.find(filter, idBloggerObj).skip(skip).limit(pageSize).toArray()
//     let allCount = await bloggersCollection.count({})