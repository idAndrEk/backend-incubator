import {BloggersRepository} from "../repositories/blogs/bloggers-repository";
import {BloggerViewType, CreateBloggerDto} from "../types/bloggersTypes";
import {PostsRepository} from "../repositories/posts/posts-repository";
import {inject, injectable} from "inversify";
import {LikesRepository} from "../repositories/like-repoository";

@injectable() // добавить
export class BlogsService {
    constructor(
        // protected bloggersRepository: BloggersRepository, // проделать blogs
        @inject(BloggersRepository) protected bloggersRepository: BloggersRepository, // проделать blogs
        protected postsRepository: PostsRepository,
        protected likesRepository: LikesRepository) {
    }

    async createBlog(name: string, youtubeUrl: string): Promise<BloggerViewType | null> {
        const newBlogger: CreateBloggerDto = {
            name: name,
            youtubeUrl: youtubeUrl,
            createdAt: new Date
        }
        const createdBlogger = await this.bloggersRepository.createBlogger(newBlogger)
        if (createdBlogger) return {
            id: createdBlogger._id.toString(),
            name: createdBlogger.name,
            youtubeUrl: createdBlogger.youtubeUrl,
            createdAt: createdBlogger.createdAt
        }
        return null
    }

    async updateBlogger(id: string, name: string, youtubeUrl: string): Promise<boolean> {
        return await this.bloggersRepository.updateBlogger(id, name, youtubeUrl)
    }

    async deleteBlogger(id: string): Promise<boolean> {
        return await this.bloggersRepository.deleteBlogger(id)
    }

    // async getBloggerPosts(blogId: string, page: number, pageSize: number, user: UserViewResponse | undefined): Promise<PaginationPostType> {
    //     let postData = await this.bloggersRepository.findPostsBlogger(blogId, page, pageSize)
    //     const totalCount = await this.bloggersRepository.countPostBlogger(blogId)
    //     const pagesCount = Math.ceil(await this.bloggersRepository.countPostBlogger(blogId) / pageSize)
    //
    //     let items: PostViewType[] = []
    //     for (const post of postData) {
    //         const {likes, dislikes} = await this.likesRepository.getLikesAndDislikesCountByParentId((post._id).toString())
    //         post.extendedLikesInfo.likesCount = likes
    //         post.extendedLikesInfo.dislikesCount = dislikes
    //         let myStatus = !user ? 'None' : await this.likesRepository.getLikeStatusByUserId((post._id).toString(), (user._id).toString())
    //         post.extendedLikesInfo.myStatus = myStatus
    //         const newestLikes = await this.likesRepository.getNewestLikesByParentId((post._id).toString(), 3)
    //         items.push({
    //             id: post._id.toString(),
    //             title: post.title,
    //             shortDescription: post.shortDescription,
    //             content: post.content,
    //             blogId: post.blogId,
    //             bloggerName: post.bloggerName,
    //             createdAt: post.createdAt,
    //             extendedLikesInfo: {
    //                 likesCount: likes,
    //                 dislikesCount: dislikes,
    //                 myStatus,
    //                 newestLikes
    //             }
    //         })
    //     }
    //     return {
    //         pagesCount: pagesCount,
    //         page: page,
    //         pageSize: pageSize,
    //         totalCount: totalCount,
    //         items
    //     }
    // }
}
