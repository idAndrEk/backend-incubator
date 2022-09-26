import {PostsRepository} from "../repositories/posts-repository";
import {PaginationPostType, PostType} from "../types/postsTypes";
import {PaginationCommentType} from "../types/CommentsTypes";
import {ObjectId} from "mongodb";
import {BloggersRepository} from "../repositories/bloggers-repository";
import {injectable} from "inversify";
import {LikesRepository} from "../repositories/like-repoository";
import {UserAccType} from "../types/UsersTypes";

@injectable()
export class PostsService {
    constructor(protected postsRepository: PostsRepository, protected bloggersRepository: BloggersRepository, protected likesRepository: LikesRepository) {
    }

    async getPosts(page: number, pageSize: number): Promise<PaginationPostType> {
        const postData = await this.postsRepository.allPosts(page, pageSize)

        const pagesCount = Math.ceil(await this.postsRepository.countPost() / pageSize)
        const totalCount = await this.postsRepository.countPost()
        return {
            pagesCount: pagesCount,
            page: page,
            pageSize: pageSize,
            totalCount: totalCount,
            items: postData
        }
    }

    async getPost(id: string, user: UserAccType | undefined): Promise<PostType | null> {
        let post = await this.postsRepository.findPostsId(id)
        if (!post) return null
        const {likes, dislikes} = await this.likesRepository.getLikesAndDislikesCountByParentId((post._id).toString())
        post.extendedLikesInfo.likesCount = likes
        post.extendedLikesInfo.dislikesCount = dislikes
        let defaultMyStatus = 'None'
        if (user) {
            defaultMyStatus = await this.likesRepository.getLikeStatusByUserId((post._id).toString(), (user._id).toString())
        }
        post.extendedLikesInfo.myStatus = defaultMyStatus
        const newestLikes = await this.likesRepository.getNewestLikesByParentId((post._id).toString(), 3)
        // let resultLikesArray = []
        // for (let like of newestLikes){
        //     resultLikesArray.push({
        //         addedAt: like.addedAt,
        //         userId: like.userId.toString(),
        //         login: like.login
        //     })
        // }
        // post.extendedLikesInfo.newestLikes = resultLikesArray
        console.log(post.extendedLikesInfo.newestLikes)
        post.extendedLikesInfo.newestLikes = newestLikes
        console.log(newestLikes)
        console.log(post.extendedLikesInfo.newestLikes)
        return post
    }

    async checkPost(id: string): Promise<PostType | null> {
        let post = await this.postsRepository.findPostsId(id)
        if (!post) return null
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
            addedAt: new Date(),
            extendedLikesInfo: {
                likesCount: 0,
                dislikesCount: 0,
                myStatus: 'None',
                newestLikes: []
            }
        }
        //add array push
        const createdPost = await this.postsRepository.createPost(newPost)
        if (createdPost) return createdPost
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