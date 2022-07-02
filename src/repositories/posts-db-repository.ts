import {postCollection} from "./db";
import {ObjectId} from "mongodb";
import {PostsType} from "../types/postsTypes";
import {bloggersService} from "../domain/blogegers-servic";

export const postsRepositories = {
    async allPosts(page: number, pageSize: number): Promise<any> {
        // const projection = {_id: 0, id: 1, "title": 1, "shortDescription": 1, "content": 1, "bloggerId": 1, "bloggerName": 1};
        const skip = (page - 1) * pageSize
        let allPosts = await postCollection.find().toArray()
        let pagesCount = allPosts.length / pageSize
        // let posts = await postCollection.find({}).project(projection).skip(skip).limit(pageSize).toArray()
        let posts = await postCollection.find({}).skip(skip).limit(pageSize).toArray()
        let allCount = await postCollection.count({})
        return {
            pagesCount: Math.ceil(pagesCount),
            page: page,
            pageSize: pageSize,
            totalCount: allCount,
            items: posts.map(post => ({
                id: post.id,
                title: post.title,
                shortDescription: post.shortDescription,
                content: post.content,
                bloggerId: post.bloggerId,
                bloggerName: post.bloggerName
            }))
        }
    },

    async findPostsId(id: number): Promise<PostsType | null> {
        const post: PostsType | null = await postCollection.findOne({id: id})
        return post
    },

    async createPost(newPost: PostsType): Promise<PostsType | null> {
        const result = await postCollection.insertOne(newPost)
        return newPost
    },

    async updatePost(id: number, title: string, shortDescription: string, content: string, bloggerId: number): Promise<boolean | null> {
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

    async deletePost(id: number): Promise<boolean> {
        const result = await postCollection.deleteOne({id: id})
        return result.deletedCount === 1
    }
}