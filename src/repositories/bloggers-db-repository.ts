import {promises} from "dns";
import {bloggersCollection, bloggersType} from "./db";
import {ObjectId} from "mongodb";

export const bloggersRepository = {
    async allBloggers(page: number, pageSize: number): Promise<any> {
        const projection = {_id: 0, id: 1, "name": 1, "youtubeUrl": 1};
        const skip = (page - 1) * pageSize
        let allBloggers = await bloggersCollection.find({}).toArray()
        let pagesCount = allBloggers.length / pageSize
        let bloggers = await bloggersCollection.find({}).project(projection).skip(skip).limit(pageSize).toArray()
        let allCount = await bloggersCollection.count({})
        return {
            pagesCount: Math.ceil(pagesCount),
            page: page,
            pageSize: pageSize,
            totalCount: allCount,
            items: bloggers
        }
    },

    async findBloggersName(name: string | null)/*: Promise<bloggersType | null>*/ {
        const filter = {} as { name: { $regex: string } }
        if (name) {
            filter.name = {$regex: name}
            return await bloggersCollection.findOne(filter)
        }
    }
    ,

    async findBloggersId(id: ObjectId): Promise<bloggersType | null> {
        const blogger: bloggersType | null = await bloggersCollection.findOne({id: id})
        return blogger
    },

    async createBlogger(newBlogger: bloggersType): Promise<boolean> {
        const result = await bloggersCollection.insertOne(newBlogger)
        return result.acknowledged
    },

    async updateBlogger(id: ObjectId, name: string, youtubeUrl: string): Promise<boolean> {
        const result = await bloggersCollection.updateOne({id: id}, {
            $set: {
                name: name,
                youtubeUrl: youtubeUrl
            }
        })
        return result.matchedCount === 1
    },

    async deleteBlogger(id: ObjectId): Promise<boolean> {
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