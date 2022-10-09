import {CommentModelClass, PostModelClass} from "../db";
import {CreatePostDto, PostType, PostViewType} from "../../types/postsTypes";
import {injectable} from "inversify";
import {SortDirection} from "../../types/paginationType";

@injectable()
export class PostsRepository {

    async createPost(newPost: CreatePostDto): Promise<PostType | null> {
        try {
            const post =  new PostModelClass(newPost)
            await post.save()
            return post
        } catch (e) {
            return null
        }
    }

    async updatePost(id: string, title: string, shortDescription: string, content: string, blogId: string): Promise<boolean | null> {
        const post = await PostModelClass.findByIdAndUpdate(id, {
            title,
            shortDescription,
            content,
            blogId
        })
        if (post) return true
        return false
    }

    async deletePost(id: string): Promise<boolean> {
        const post = await PostModelClass.findByIdAndDelete(id)
        if (post) return true
        return false
    }

}


