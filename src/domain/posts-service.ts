import {postsRepositories} from "../repositories/posts-db-repository";
import {PaginationPostType, PostType} from "../types/postsTypes";
import {bloggersRepository} from "../repositories/bloggers-db-repository";
import {v4 as uuidv4} from "uuid";
import {PaginationCommentType} from "../types/CommentsTypes";

export const postsService = {
    async allPosts(page: number, pageSize: number): Promise<PaginationPostType> {
        const postData = await postsRepositories.allPosts(page, pageSize)
        const pagesCount = Math.ceil(await postsRepositories.countPost() / pageSize)
        const totalCount = await postsRepositories.countPost()
        return {
            "pagesCount": pagesCount,
            "page": page,
            "pageSize": pageSize,
            "totalCount": totalCount,
            "items": postData
        }
    },

    async findPostsId(id: string): Promise<PostType | null> {
        return await postsRepositories.findPostsId(id)
    },

    async createPost(title: string, shortDescription: string, content: string, bloggerId: string): Promise<PostType | null> {
        const blogger = await bloggersRepository.findBloggerById(bloggerId);
        if (!blogger) return null
        const newPost = {
            id: uuidv4(),
            title: title,
            bloggerName: blogger.name,
            shortDescription: shortDescription,
            content: content,
            bloggerId: bloggerId,
        }
        const isPostCreated = await postsRepositories.createPost(newPost)
        if (isPostCreated) return newPost
        return null
    },

    async updatePost(id: string, title: string, shortDescription: string, content: string, bloggerId: string): Promise<boolean | null> {
        return await postsRepositories.updatePost(id, title, shortDescription, content, bloggerId)

    },

    async deletePost(id: string): Promise<boolean> {
        return await postsRepositories.deletePost(id)
    },

    async findPostComment(postId: string, page: number, pageSize: number): Promise<PaginationCommentType> {
        const commentData = await postsRepositories.findPostComment(postId, page, pageSize);
        const totalCount = await postsRepositories.countPostComment(postId);
        const pagesCount = Math.ceil(await postsRepositories.countPostComment(postId) / pageSize);
        return {
            "pagesCount": pagesCount,
            "page": page,
            "pageSize": pageSize,
            "totalCount": totalCount,
            "items": commentData
        }
    }
}