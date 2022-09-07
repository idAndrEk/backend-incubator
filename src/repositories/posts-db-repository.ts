import {CommentModel, PostModel} from "./db";
import {PostType} from "../types/postsTypes";
import {ifError} from "assert";

export const postsRepositories = {
    async countPost(): Promise<number> {
        const count = await PostModel.countDocuments({})
        return count
    },

    async allPosts(page: number, pageSize: number): Promise<PostType[]> {
        const post = PostModel
            .find({})
            .skip((page - 1) * pageSize)
            .limit(pageSize)
        return post
    },

    async findPostsId(id: string): Promise<PostType | null> {
        const post = await PostModel.findById(id)
        return post
    },

    async createPost(newPost: PostType): Promise<PostType | null> {
        try {
            const post = new PostModel(newPost)
            return post.save()
        } catch (e) {
            return null
        }
    },

    async updatePost(id: string, title: string, shortDescription: string, content: string, bloggerId: string): Promise<boolean | null> {
        const post = await PostModel.findByIdAndUpdate(id, {
            title,
            shortDescription,
            content,
            bloggerId
        })
        if (post) return true
        return false
    },

    async deletePost(id: string): Promise<boolean> {
        const post = await PostModel.findByIdAndDelete(id)
        if (post) return true
        return false
    },

    async countPostComment(postId: string | null) {
        let filter = {}
        if (postId) {
            filter = {$regex: postId}
        }
        return CommentModel.count(filter)
    },

    async findPostComment(postId: string | null, page: number, pageSize: number) {
        let filter = {}
        if (postId) {
            filter = {$regex: postId}
        }
        return CommentModel
            .find(filter)
            .skip((page - 1) * pageSize)
            .limit(pageSize)
    }
}


