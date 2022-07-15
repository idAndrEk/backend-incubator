import {postsRepositories} from "../repositories/posts-db-repository";
import {posts} from "../repositories/posts-im-memory-repository";
import {postCollection} from "../repositories/db";
import {ObjectId} from "mongodb";
import {PostsType} from "../types/postsTypes";
import {PaginationType} from "../types/bloggersTypes";

export const postsServise = {
    async allPosts(page: number, pageSize: number): Promise<PaginationType<PostsType>> {
        return await postsRepositories.allPosts(page, pageSize)
    },

    async findPostsId(postId: string): Promise<PostsType | null> {
        const post: PostsType | null = await postCollection.findOne({id: postId})
        if (!post) {
            return null
        }
        const {title, shortDescription, content, bloggerId, bloggerName, id} = post
        return {title, shortDescription, content, bloggerId, bloggerName, id}
    },

    async createPost(title: string, shortDescription: string, content: string, bloggerId: string, bloggerName: string): Promise<PostsType | null> {
        const newPost = {
            // id: new Date(), //posts.length + 1, //new ObjectId()
            title: title,
            shortDescription: shortDescription,
            content: content,
            bloggerId: bloggerId,
            bloggerName: bloggerName
        }
        const createdPost = await postsRepositories.createPost(newPost)
        if (createdPost) {
            return {
                ...createdPost
            }
        }
        return null
    },

    async updatePost(id: string, title: string, shortDescription: string, content: string, bloggerId: string): Promise<boolean | null> {
        return await postsRepositories.updatePost(id, title, shortDescription, content, bloggerId)

    },
    async deletePost(id: string): Promise<boolean> {
        return await postsRepositories.deletePost(id)
    }
}