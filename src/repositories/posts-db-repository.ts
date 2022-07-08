import {postCollection} from "./db";
import {ObjectId} from "mongodb";
import {PostsType} from "../types/postsTypes";
import {bloggersService} from "../domain/bloggers-service";
import {PaginationType} from "../types/bloggersTypes";

export const postsRepositories = {
    async allPosts(page: number, pageSize: number): Promise<PaginationType<PostsType>> {
        const skip = (page - 1) * pageSize
        let allPostsCount = await postCollection.countDocuments()
        let pagesCount = allPostsCount / pageSize
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
        // const result = await postCollection.insertOne(newPost)
        // return newPost

        const {
            title,
            shortDescription,
            content,
            bloggerId,
            bloggerName
        } = newPost
        const result = await postCollection.insertOne(newPost);
        if (!result.acknowledged) {
            return null
        }
        return {
            title,
            shortDescription,
            content,
            bloggerId,
            bloggerName,
            id: newPost.id
        }
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