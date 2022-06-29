import {postsRepositories} from "../repositories/posts-db-repository";
import {posts} from "../repositories/posts-im-memory-repository";
import {postCollection, postsType} from "../repositories/db";

export const postsServise = {
    async allPosts(): Promise<postsType[]> {
        return postsRepositories.allPosts()
    },

    async findPostsId(id: number): Promise<postsType | null> {
        const post: postsType | null = await postCollection.findOne({id: id})
        return post
    },

    async createPost(title: string, shortDescription: string, content: string, bloggerId: number, bloggerName: string): Promise<postsType | null> {
        const newPost = {
            id:  posts.length + 1, //+(new Date()),
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