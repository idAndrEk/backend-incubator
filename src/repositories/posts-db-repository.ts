import {commentCollection, postCollection} from "./db";
import {ObjectId} from "mongodb";
import {PostPayloadType, PostResponseType} from "../types/postsTypes";
import {PaginationType} from "../types/bloggersTypes";

export const postsRepositories = {
    async allPosts(page: number, pageSize: number): Promise<PaginationType<PostResponseType>> {
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
                id: post._id.toString(),
                title: post.title,
                shortDescription: post.shortDescription,
                content: post.content,
                bloggerId: post.bloggerId,
                bloggerName: post.bloggerName
            }))
        }
    },

    async findPostsId(id: string): Promise<PostResponseType | null> {
        const post = await postCollection.findOne({_id: new ObjectId(id)})
        if (!post) {
            return null
        }
        return {
            bloggerId: post.bloggerId,
            content: post.content,
            shortDescription: post.shortDescription,
            title: post.title,
            bloggerName: post.bloggerName,
            id: post._id.toString()
        }
    },

    async createPost(newPost: PostPayloadType): Promise<PostResponseType | null> {
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
            bloggerName,
            title,
            shortDescription,
            content,
            bloggerId,
            id: result.insertedId.toString()
        }
    },

    async updatePost(id: string, title: string, shortDescription: string, content: string, bloggerId: string): Promise<boolean | null> {
        const result = await postCollection.updateOne({_id: new ObjectId(id)}, { //new object
            $set: {
                title: title,
                shortDescription: shortDescription,
                content: content,
                bloggerId: bloggerId
            }
        })
        return result.matchedCount === 1
    },

    async deletePost(id: string): Promise<boolean> {
        const result = await postCollection.deleteOne({_id: new ObjectId(id)})
        return result.deletedCount === 1
    },

    async findPostComment(id: string, page: number, pageSize: number): Promise<any> {
        let filter = {}
        if (id) {
            filter = {id}
        }
        const skip = (page - 1) * pageSize
        let allCommentCount = await commentCollection.count(filter)
        let pagesCount = allCommentCount / pageSize
        let comment = await commentCollection.find(filter).skip(skip).limit(pageSize).toArray()
        return {
            pagesCount: Math.ceil(pagesCount),
            page: page,
            pageSize: pageSize,
            totalCount: allCommentCount,
            items: comment.map(comment => ({
                id: comment._id.toString(),
                content: comment.content,
                userId: comment.userId,
                userLogin: comment.userLogin,
                addedAt: new Date().toString()
            }))
        }
    }
}

