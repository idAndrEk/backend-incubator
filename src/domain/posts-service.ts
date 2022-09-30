import {PostsRepository} from "../repositories/posts-repository";
import {CreatePostDto, PaginationPostType, PostType, PostViewType} from "../types/postsTypes";
import {PaginationCommentType} from "../types/commentsTypes";
import {BloggersRepository} from "../repositories/bloggers-repository";
import {injectable} from "inversify";
import {LikesRepository} from "../repositories/like-repoository";
import {UserAccType, UserViewResponse} from "../types/UsersTypes";

@injectable()
export class PostsService {
    constructor(protected postsRepository: PostsRepository, protected bloggersRepository: BloggersRepository, protected likesRepository: LikesRepository) {
    }

    async getPosts(page: number, pageSize: number, user: UserViewResponse | undefined): Promise<PaginationPostType> {
        const postData = await this.postsRepository.getPosts(page, pageSize)
        // console.log('POST DATA', postData)
        const pagesCount = Math.ceil(await this.postsRepository.countPost() / pageSize)
        const totalCount = await this.postsRepository.countPost()

        // let likes = []

        let items: PostViewType[] = []
        for (let i = 0; i < postData.length; i++) {
            const post = postData[i]
            const {likes, dislikes} = await this.likesRepository.getLikesAndDislikesCountByParentId((post._id).toString())
            post.extendedLikesInfo.likesCount = likes
            post.extendedLikesInfo.dislikesCount = dislikes
            console.log(user)
            let myStatus = !user ? 'None' : await this.likesRepository.getLikeStatusByUserId((post._id).toString(), (user._id).toString())
            post.extendedLikesInfo.myStatus = myStatus
            const newestLikes = await this.likesRepository.getNewestLikesByParentId((post._id).toString(), 3)
            items.push({
                id: post._id.toString(),
                title: post.title,
                shortDescription: post.shortDescription,
                content: post.content,
                bloggerId: post.bloggerId,
                bloggerName: post.bloggerName,
                addedAt: post.addedAt,
                extendedLikesInfo: {
                    likesCount: likes,
                    dislikesCount: dislikes,
                    myStatus,
                    newestLikes
                }
            })

        }
        return {
            pagesCount: pagesCount,
            page: page,
            pageSize: pageSize,
            totalCount: totalCount,
            items
        }
    }

    async getPost(id: string, user: UserViewResponse | undefined): Promise<PostViewType | null> {
        let post = await this.postsRepository.getPost(id)
        if (!post) return null
        const {likes, dislikes} = await this.likesRepository.getLikesAndDislikesCountByParentId((post._id).toString())
        post.extendedLikesInfo.likesCount = likes
        post.extendedLikesInfo.dislikesCount = dislikes
        // let defaultMyStatus = 'None'
        // if (user) {
        //     defaultMyStatus = await this.likesRepository.getLikeStatusByUserId((post._id).toString(), (user._id).toString())
        // }
        // post.extendedLikesInfo.myStatus = defaultMyStatus
        const newestLikes = await this.likesRepository.getNewestLikesByParentId((post._id).toString(), 3)
        post.extendedLikesInfo.newestLikes = newestLikes
        return {
            id: post._id.toString(),
            title: post.title,
            shortDescription: post.shortDescription,
            content: post.content,
            bloggerId: post.bloggerId,
            bloggerName: post.bloggerName,
            addedAt: post.addedAt,
            extendedLikesInfo: {
                likesCount: post.extendedLikesInfo.likesCount,
                dislikesCount: post.extendedLikesInfo.dislikesCount,
                myStatus: await this.likesRepository.getLikeStatusByUserId((post._id).toString(), (user!._id).toString()),
                newestLikes
            }
        }
    }

    async checkPost(id: string): Promise<PostType | null> {
        let post = await this.postsRepository.getPost(id)
        if (!post) return null
        return post
    }

    async createPost(title: string, shortDescription: string, content: string, bloggerId: string): Promise<PostViewType | null> {
        const blogger = await this.bloggersRepository.getBloggerById(bloggerId);
        if (!blogger) return null
        const newPost: CreatePostDto = {
            title: title,
            bloggerName: blogger.name,
            shortDescription: shortDescription,
            content: content,
            bloggerId: bloggerId,
            addedAt: new Date(),
            extendedLikesInfo: {
                likesCount: 0,
                dislikesCount: 0,
                myStatus: 'None',
                newestLikes: []
            }
        }
        const createdPost = await this.postsRepository.createPost(newPost)
        if (createdPost) return {
            id: createdPost._id.toString(),
            title: createdPost.title,
            bloggerName: createdPost.bloggerName,
            shortDescription: createdPost.shortDescription,
            content: createdPost.content,
            bloggerId: createdPost.bloggerId,
            addedAt: createdPost.addedAt,
            extendedLikesInfo: {
                likesCount: 0,
                dislikesCount: 0,
                myStatus: 'None',
                newestLikes: []
            }
        }
        return null
    }

    async updatePost(id: string, title: string, shortDescription: string, content: string, bloggerId: string): Promise<boolean | null> {
        return await this.postsRepository.updatePost(id, title, shortDescription, content, bloggerId)
    }

    async addLikeToPost(postId: string, userId: string, login: string, likeStatus: string): Promise<boolean> {
        try {
            await this.likesRepository.addLikeOrDislikeOrNone(postId, userId, login, likeStatus)
            return true
        } catch (e) {
            return false
        }
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

// let resultLikesArray = []
// for (let like of newestLikes){
//     resultLikesArray.push({
//         addedAt: like.addedAt,
//         userId: like.userId.toString(),
//         login: like.login
//     })
// }
// post.extendedLikesInfo.newestLikes = resultLikesArray
// console.log(post.extendedLikesInfo.newestLikes)


// async getPost(id: string, user: UserAccType | undefined): Promise<PostViewType | null> {
//     let post = await this.postsRepository.getPost(id)
//     if (!post) return null
//     await this.likesRepository.getLikesCountByParentId((post._id).toString())
//     await this.likesRepository.getDislikesCountByParentId((post._id).toString())
//     await this.likesRepository.getLikeStatusByUserId((post._id).toString(), (user!._id).toString())
//     return {
//         id: post._id.toString(),
//         title: post.title,
//         shortDescription: post.shortDescription,
//         content: post.content,
//         bloggerId: post.bloggerId,
//         bloggerName: post.bloggerName,
//         addedAt: post.addedAt,
//         extendedLikesInfo: {
//             likesCount: post.extendedLikesInfo.likesCount,
//             dislikesCount: post.extendedLikesInfo.dislikesCount,
//             myStatus: post.extendedLikesInfo.myStatus,
//             newestLikes: await this.likesRepository.getNewestLikesByParentId((post._id).toString(), 3)
//         }
//     }
// }
