import {CommentModelClass, PostModelClass} from "./db";
import {CreatePostDto, PostType, PostViewType} from "../types/postsTypes";
import {injectable} from "inversify";

@injectable()
export class PostsRepository {
    async countPost(): Promise<number> {
        const count = await PostModelClass.countDocuments({})
        return count
    }

    async getPosts(page: number, pageSize: number): Promise<PostType[]> {
        const post = PostModelClass
            .find({})
            .skip((page - 1) * pageSize)
            .limit(pageSize)
            .lean()
        return post
    }

    async getPost(id: string): Promise<PostType | null> {
        const post = await PostModelClass.findById(id)
        if (!post) return null
        return post
    }

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


// async findPostsId(id: string): Promise<PostType | null> {
//     const post = await PostModelClass
//         .aggregate()
//         .project({
//             id: '$_id',
//             title: true,
//             shortDescription: true,
//             content: true,
//             blogId: true,
//             bloggerName: true,
//             createdAt: true,
//             extendedLikesInfo: true,
//             _id: 0
//         })
//
//     return post
// }

// async findPostsId(id: string): Promise<PostType | null> {
//     // const post = await PostModelClass.aggregate([
//     // {
//     //     $project: {
//     //         _id: false,
//     //         id: '$_id',
//     //         title: true,
//     //         shortDescription: true,
//     //         content: true,
//     //         blogId: true,
//     //         bloggerName: true,
//     //         createdAt: true,
//     //         extendedLikesInfo: true
//     //     }
//     // }])
//     const post = await PostModelClass.findById(id)
//         .lean()
//     return post
//     // .project({id: '$_id', _id: 0})
// }

// async addLike(likeDB: LikePostCollectionType): Promise<boolean> {
//     // const updateLikePost = await PostModelClass.updateOne({'extendedLikesInfo.myStatus': likeDB.status})
//     const addLikePostDB = await PostLikeModelClass.create(likeDB)
//     if (addLikePostDB) return true
//     return false
// }


