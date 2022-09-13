import {PostsRepository} from "../repositories/posts-repository";
import {PaginationPostType, PostType} from "../types/postsTypes";
import {PaginationCommentType} from "../types/CommentsTypes";
import {ObjectId} from "mongodb";
import {BloggersRepository} from "../repositories/bloggers-repository";

export class PostsService {
    constructor(protected postsRepository: PostsRepository, protected bloggersRepository: BloggersRepository) {}

    async getPosts(page: number, pageSize: number): Promise<PaginationPostType> {
        const postData = await this.postsRepository.allPosts(page, pageSize)
        const pagesCount = Math.ceil(await this.postsRepository.countPost() / pageSize)
        const totalCount = await this.postsRepository.countPost()
        return {
            "pagesCount": pagesCount,
            "page": page,
            "pageSize": pageSize,
            "totalCount": totalCount,
            "items": postData
        }
    }

    async getPost(id: string): Promise<PostType | null> {
        const post = await this.postsRepository.findPostsId(id)
        return post
    }

    async createPost(title: string, shortDescription: string, content: string, bloggerId: string): Promise<PostType | null> {
        const blogger = await this.bloggersRepository.getBloggerById(bloggerId);
        if (!blogger) return null
        const newPost = {
            _id: new ObjectId(),
            title: title,
            bloggerName: blogger.name,
            shortDescription: shortDescription,
            content: content,
            bloggerId: bloggerId,
        }
        const createdPost = await this.postsRepository.createPost(newPost)
        if (createdPost) return createdPost
        return null
    }

    async updatePost(id: string, title: string, shortDescription: string, content: string, bloggerId: string): Promise<boolean | null> {
        return await this.postsRepository.updatePost(id, title, shortDescription, content, bloggerId)
    }

    async deletePost(id: string): Promise<boolean> {
        return await this.postsRepository.deletePost(id)
    }

    async getPostComment(postId: string, page: number, pageSize: number): Promise<PaginationCommentType> {
        const commentData = await this.postsRepository.findPostComment(postId, page, pageSize);
        const totalCount = await this.postsRepository.countPostComment(postId);
        const pagesCount = Math.ceil(await this.postsRepository.countPostComment(postId) / pageSize);
        return {
            "pagesCount": pagesCount,
            "page": page,
            "pageSize": pageSize,
            "totalCount": totalCount,
            "items": commentData
        }
    }
}