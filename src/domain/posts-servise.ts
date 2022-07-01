import {postsRepositories} from "../repositories/posts-db-repository";
import {posts} from "../repositories/posts-im-memory-repository";
import {postCollection, postsType} from "../repositories/db";
import {ObjectId} from "mongodb";

export const postsServise = {
    async allPosts(page: number, pageSize: number): Promise<postsType[]> {
        return await postsRepositories.allPosts(page, pageSize)
    },

    async findPostsId(id: ObjectId): Promise<postsType | null> {
        const post: postsType | null = await postCollection.findOne({id: id})
        return post
    },

    async createPost(title: string, shortDescription: string, content: string, bloggerId: number, bloggerName: string): Promise<postsType | null> {
        const newPost = {
            id: new ObjectId(), //+(new Date()), //posts.length + 1,
            title: title,
            shortDescription: shortDescription,
            content: content,
            bloggerId: bloggerId,
            bloggerName: bloggerName
        }
        const createdPost = await postsRepositories.createPost(newPost)
        return createdPost
    },

    async updatePost(id: ObjectId, title: string, shortDescription: string, content: string, bloggerId: number): Promise<boolean | null> {
        return await postsRepositories.updatePost(id, title, shortDescription, content, bloggerId)

    },
    async deletePost(id: ObjectId): Promise<boolean> {
        return await postsRepositories.deletePost(id)
    }
}