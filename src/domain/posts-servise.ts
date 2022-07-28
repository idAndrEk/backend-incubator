import {postsRepositories} from "../repositories/posts-db-repository";
import {PostPayloadType, PostResponseType} from "../types/postsTypes";
import {PaginationType} from "../types/bloggersTypes";
import {bloggersRepository} from "../repositories/bloggers-db-repository";

export const postsServise = {
    async allPosts(page: number, pageSize: number): Promise<PaginationType<PostResponseType>> {
        return await postsRepositories.allPosts(page, pageSize)
    },

    async findPostsId(id: string): Promise<PostResponseType | null> {
        return await postsRepositories.findPostsId(id)
    },

    // const post = await postCollection.findOne(id)
    // if (!post) {
    //     return null
    // }
    //
    // const {title, shortDescription, content, bloggerId, bloggerName} = post
    // return {title, shortDescription, content, bloggerId, bloggerName, id: post._id.toString()}

    async createPost(title: string, shortDescription: string, content: string, bloggerId: string): Promise<PostResponseType | null> {
        const blogger = await bloggersRepository.findBloggerById(bloggerId);
        if (!blogger) {
            return null
        }
        const newPost: PostPayloadType = {
            // id: new Date(), //posts.length + 1, //new ObjectId()
            title: title,
            bloggerName: blogger.name,
            shortDescription: shortDescription,
            content: content,
            bloggerId: bloggerId,
        }
        const createdPost = await postsRepositories.createPost(newPost)

        if (createdPost) {
            return createdPost
        }
        return null
    },

    async updatePost(id: string, title: string, shortDescription: string, content: string, bloggerId: string): Promise<boolean | null> {
        return await postsRepositories.updatePost(id, title, shortDescription, content, bloggerId)

    },

    async deletePost(id: string): Promise<boolean> {
        return await postsRepositories.deletePost(id)
    },

    async findPostComment(postId: string, page: number, pageSize: number) {
        const comment = await postsRepositories.findPostComment(postId, page, pageSize);
        return comment
    }

}