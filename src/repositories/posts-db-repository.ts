import {postCollection, postsType} from "./db";
import {ObjectId} from "mongodb";

export const postsRepositories = {
    async allPosts(page: number, pageSize: number): Promise<any> {
        const projection = {_id: 0, id: 1, "title": 1, "shortDescription": 1, "content": 1, "bloggerId": 1, "bloggerName": 1};
        const skip = (page - 1) * pageSize
        let allPosts = await postCollection.find().toArray()
        let pagesCount = allPosts.length / pageSize
        let posts = await postCollection.find({}).project(projection).skip(skip).limit(pageSize).toArray()
        let allCount = await postCollection.count({})
        return {
            pagesCount: (pagesCount),
            page: page,
            pageSize: pageSize,
            totalCount: allCount,
            items: posts
        }
    },

    async findPostsId(id: ObjectId): Promise<postsType | null> {
        const post: postsType | null = await postCollection.findOne({id: id})
        return post
    },

    async createPost(newPost: postsType): Promise<postsType | null> {
        const result = await postCollection.insertOne(newPost)
        return newPost
    },

    async updatePost(id: ObjectId, title: string, shortDescription: string, content: string, bloggerId: number): Promise<boolean | null> {
        const result = await postCollection.updateOne({id: id}, {
            $set: {
                title: title,
                shortDescription: shortDescription,
                content: content,
                bloggerId: bloggerId
            }
        })
        return result.matchedCount === 1
    },

    async deletePost(id: ObjectId): Promise<boolean> {
        const result = await postCollection.deleteOne({id: id})
        return result.deletedCount === 1
    }
}