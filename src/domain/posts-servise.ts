import {postsRepositories} from "../repositories/posts-db-repository";
import {posts} from "../repositories/posts-im-memory-repository";
import {postCollection} from "../repositories/db";
import {ObjectId} from "mongodb";
import {PostsType} from "../types/postsTypes";

export const postsServise = {
    async allPosts(page: number, pageSize: number): Promise<PostsType[]> {
        return await postsRepositories.allPosts(page, pageSize)
    },

    async findPostsId(id: number): Promise<PostsType | null> {
        const post: PostsType | null = await postCollection.findOne({id: id})
        return post
    },

    async createPost(title: string, shortDescription: string, content: string, bloggerId: number, bloggerName: string): Promise<PostsType | null> {
        const newPost = {
            id: +(new Date()), //posts.length + 1, //new ObjectId()
            title: title,
            shortDescription: shortDescription,
            content: content,
            bloggerId: bloggerId,
            bloggerName: bloggerName
        }
        const createdPost = await postsRepositories.createPost(newPost)
        return createdPost
    },

    async updatePost(id: number, title: string, shortDescription: string, content: string, bloggerId: number): Promise<boolean | null> {
        return await postsRepositories.updatePost(id, title, shortDescription, content, bloggerId)

    },
    async deletePost(id: number): Promise<boolean> {
        return await postsRepositories.deletePost(id)
    }
}