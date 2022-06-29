import {promises} from "dns";
import {bloggersCollection, bloggersType} from "./db";
import {query, Request} from "express";

// export const bloggers = [
//     {id: 1, name: 'IT-KAMASUTRA', youtubeUrl: 'https://www.youtube.com/c/ITKAMASUTRA'},
//     {id: 2, name: 'webDev', youtubeUrl: 'https://www.youtube.com/c/YauhenKavalchuk'},
//     {id: 3, name: 'Egor Malkevich', youtubeUrl: 'https://www.youtube.com/c/EgorMalkevich'},
//     {id: 4, name: 'Ulbi TV', youtubeUrl: 'https://www.youtube.com/c/UlbiTV'},
// ]

export const bloggersRepository = {
    async allBloggers(page: number, pageSize: number): Promise<any> {
        const skip = (page - 1) * pageSize
        let allBloggers = await bloggersCollection.find({}).toArray()
        let pagesCount = allBloggers.length / pageSize
        let bloggers = await bloggersCollection.find({}).project({ _id:0, id:1, "name":1, "youtubeUrl":1 }).skip(skip).limit(pageSize).toArray()
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
        const filter = {} as {name: {$regex: string}}
        if (name) {
            filter.name = {$regex: name}
            return await bloggersCollection.findOne(filter)
        }
        // const result: bloggersType | null = await bloggersCollection.findOne( {$regex: name});
        // return result
    }
    ,

    async findBloggersId(id: number): Promise<bloggersType | null> {
        const blogger: bloggersType | null = await bloggersCollection.findOne({id: id})
        return blogger
    },

    async createBlogger(newBlogger: bloggersType): Promise<bloggersType | null> {
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