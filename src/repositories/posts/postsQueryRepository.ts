import {BloggerModelClass, PostModelClass} from "../db";
import {SortDirection} from "../../types/paginationType";
import {PaginationPostType, PostType, PostViewType} from "../../types/postsTypes";
import {injectable} from "inversify";
import {UserViewResponse} from "../../types/UsersTypes";
import {getCountPage, getSkipPage} from "../../helpers/getPage";
import {LikesRepository} from "../like-repoository";

@injectable()
export class PostsQueryRepository {
    constructor(protected likesRepository: LikesRepository) {}

    async getPosts(page: number, pageSize: number, user: UserViewResponse | undefined, sortBy: string, sortDirection: SortDirection): Promise<PaginationPostType> {
        const findPosts= await PostModelClass
            .find({})
            .skip(getSkipPage(page, pageSize))
            .limit(pageSize)
            .sort({[sortBy]: sortDirection === SortDirection.Asc ? 1 : -1})
            .lean()
        const totalCount = await PostModelClass.countDocuments({})
        let items: PostViewType[] = []
        for (const post of findPosts) {
            const {
                likes,
                dislikes
            } = await this.likesRepository.getLikesAndDislikesCountByParentId((post._id).toString())
            post.extendedLikesInfo.likesCount = likes
            post.extendedLikesInfo.dislikesCount = dislikes
            let myStatus = !user ? 'None' : await this.likesRepository.getLikeStatusByUserId((post._id).toString(), (user._id).toString())
            post.extendedLikesInfo.myStatus = myStatus
            const newestLikes = await this.likesRepository.getNewestLikesByParentId((post._id).toString(), 3)
            items.push({
                id: post._id.toString(),
                title: post.title,
                shortDescription: post.shortDescription,
                content: post.content,
                blogId: post.blogId,
                bloggerName: post.bloggerName,
                createdAt: post.createdAt,
                extendedLikesInfo: {
                    likesCount: likes,
                    dislikesCount: dislikes,
                    myStatus,
                    newestLikes
                }
            })
        }
        return {
            pagesCount: getCountPage(totalCount ,pageSize),
            page: page,
            pageSize: pageSize,
            totalCount: totalCount,
            items
        }
    }

    async getPost(id: string, user: UserViewResponse | undefined): Promise<PostViewType | null> {
        const post = await PostModelClass.findById(id)
        if (!post) return null
        const {likes, dislikes} = await this.likesRepository.getLikesAndDislikesCountByParentId((post._id).toString())
        post.extendedLikesInfo.likesCount = likes
        post.extendedLikesInfo.dislikesCount = dislikes
        let defaultMyStatus = 'None'
        if (user) {
            defaultMyStatus = await this.likesRepository.getLikeStatusByUserId((post._id).toString(), (user._id).toString())
            console.log(defaultMyStatus)
        }
        post.extendedLikesInfo.myStatus = defaultMyStatus
        const newestLikes = await this.likesRepository.getNewestLikesByParentId((post._id).toString(), 3)
        post.extendedLikesInfo.newestLikes = newestLikes
        return {
            id: post._id.toString(),
            title: post.title,
            shortDescription: post.shortDescription,
            content: post.content,
            blogId: post.blogId,
            bloggerName: post.bloggerName,
            createdAt: post.createdAt,
            extendedLikesInfo: {
                likesCount: post.extendedLikesInfo.likesCount,
                dislikesCount: post.extendedLikesInfo.dislikesCount,
                myStatus: post.extendedLikesInfo.myStatus,
                newestLikes
            }
        }
    }

    async checkPost(id: string): Promise<PostType | null> {
        let post = await PostModelClass.findById(id)
        if (!post) return null
        return post
    }

    async findPostsBlogger(blogId: string, page: number, pageSize: number, user: UserViewResponse | undefined): Promise<PaginationPostType> {
        const postData = await PostModelClass
            .find({blogId})
            .skip(getSkipPage(page, pageSize))
            .limit(pageSize)
            .lean()
        const totalCount = await BloggerModelClass.countDocuments({blogId})
        let items: PostViewType[] = []
        for (const post of postData) {
            const {likes, dislikes} = await this.likesRepository.getLikesAndDislikesCountByParentId((post._id).toString())
            post.extendedLikesInfo.likesCount = likes
            post.extendedLikesInfo.dislikesCount = dislikes
            let myStatus = !user ? 'None' : await this.likesRepository.getLikeStatusByUserId((post._id).toString(), (user._id).toString())
            post.extendedLikesInfo.myStatus = myStatus
            const newestLikes = await this.likesRepository.getNewestLikesByParentId((post._id).toString(), 3)
            items.push({
                id: post._id.toString(),
                title: post.title,
                shortDescription: post.shortDescription,
                content: post.content,
                blogId: post.blogId,
                bloggerName: post.bloggerName,
                createdAt: post.createdAt,
                extendedLikesInfo: {
                    likesCount: likes,
                    dislikesCount: dislikes,
                    myStatus,
                    newestLikes
                }
            })
        }
        return {
            pagesCount: getCountPage(totalCount ,pageSize),
            page: page,
            pageSize: pageSize,
            totalCount: totalCount,
            items
        }
    }
}