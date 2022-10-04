import {BloggersRepository} from "../repositories/bloggers-repository";
import {BloggerType, BloggerViewType, CreateBloggerDto, PaginationBloggerType} from "../types/bloggersTypes";
import {PaginationPostType, PostViewType} from "../types/postsTypes";
import {PostsRepository} from "../repositories/posts-repository";
import {injectable} from "inversify";
import {UserViewResponse} from "../types/UsersTypes";
import {LikesRepository} from "../repositories/like-repoository";

@injectable()
export class BloggersService {
    constructor(
        protected bloggersRepository: BloggersRepository,
        protected postsRepository: PostsRepository,
        protected likesRepository: LikesRepository) {
    }

    async getBloggers(page: number, pageSize: number, name: string | null): Promise<PaginationBloggerType> {
        const bloggerData = await this.bloggersRepository.getBloggers(page, pageSize, name)
        const pagesCount = Math.ceil(await this.bloggersRepository.countBlogger(name) / pageSize)
        const totalCount = await this.bloggersRepository.countBlogger(name)
        return {
            "pagesCount": pagesCount,
            "page": page,
            "pageSize": pageSize,
            "totalCount": totalCount,
            "items": bloggerData.map(bloggerData => ({
                id: bloggerData._id.toString(),
                name: bloggerData.name,
                youtubeUrl: bloggerData.youtubeUrl
            }))
        }
    }

    async getBlogger(id: string): Promise<BloggerViewType | null> {
        const blogger = await this.bloggersRepository.getBloggerById(id)
        if (!blogger) return null
        return {
            id: blogger._id.toString(),
            name: blogger.name,
            youtubeUrl: blogger.youtubeUrl
        }
    }

    async createBlogger(name: string, youtubeUrl: string): Promise<BloggerViewType | null> {
        const newBlogger: CreateBloggerDto = {
            name: name,
            youtubeUrl: youtubeUrl
        }
        const createdBlogger = await this.bloggersRepository.createBlogger(newBlogger)
        if (createdBlogger) return {
            id: createdBlogger._id.toString(),
            name: createdBlogger.name,
            youtubeUrl: createdBlogger.youtubeUrl
        }
        return null
    }

    async updateBlogger(id: string, name: string, youtubeUrl: string): Promise<boolean> {
        return await this.bloggersRepository.updateBlogger(id, name, youtubeUrl)
    }

    async deleteBlogger(id: string): Promise<boolean> {
        return await this.bloggersRepository.deleteBlogger(id)
    }

    async getBloggerPosts(bloggerId: string, page: number, pageSize: number, user: UserViewResponse | undefined): Promise<PaginationPostType> {
        let postData = await this.bloggersRepository.findPostsBlogger(bloggerId, page, pageSize)
        const totalCount = await this.bloggersRepository.countPostBlogger(bloggerId)
        const pagesCount = Math.ceil(await this.bloggersRepository.countPostBlogger(bloggerId) / pageSize)

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
}
