import {CommentModelClass, PostLikeModelClass, PostModelClass} from "./db";
import {PostType} from "../types/postsTypes";
import {injectable} from "inversify";
import {LikePostCollectionType} from "../types/likeTypes";
import {ObjectId} from "mongodb";

@injectable()
export class PostsRepository {
    async countPost(): Promise<number> {
        const count = await PostModelClass.countDocuments({})
        return count
    }

    async allPosts(page: number, pageSize: number): Promise<PostType[]> {
        const post = PostModelClass
            .find({})
            // .find({}, {_id: false, __v: false})
            .skip((page - 1) * pageSize)
            .limit(pageSize)
        // .lean()
        return post
    }

    async findPostsId(id: string): Promise<PostType | null> {
        const post = await PostModelClass.findById(id)
        return post
    }

    async createPost(newPost: PostType): Promise<PostType | null> {
        try {
            const post = new PostModelClass(newPost)
            return post.save()
        } catch (e) {
            return null
        }
    }

    async updatePost(id: string, title: string, shortDescription: string, content: string, bloggerId: string): Promise<boolean | null> {
        const post = await PostModelClass.findByIdAndUpdate(id, {
            title,
            shortDescription,
            content,
            bloggerId
        })
        if (post) return true
        return false
    }

    async addLike(likeDB: LikePostCollectionType): Promise<boolean> {
        const updateLikePost = await PostModelClass.updateOne({'extendedLikesInfo.myStatus': likeDB.status})
        const addLikePostDB = await PostLikeModelClass.create(likeDB)
        if (addLikePostDB && updateLikePost) return true
        return false
    }

    async deletePost(id: string): Promise<boolean> {
        const post = await PostModelClass.findByIdAndDelete(id)
        if (post) return true
        return false
    }

    async countPostComment(postId: string | null) {
        let filter = {}
        if (postId) {
            filter = {$regex: postId}
        }
        return CommentModelClass.count(filter)
    }

    async findPostComment(postId: string | null, page: number, pageSize: number) {
        let filter = {}
        if (postId) {
            filter = {$regex: postId}
        }
        return CommentModelClass
            .find(filter)
            .skip((page - 1) * pageSize)
            .limit(pageSize)
            .lean()
    }
}

