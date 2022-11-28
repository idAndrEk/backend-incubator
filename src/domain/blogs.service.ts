import {BlogsRepository} from "../repositories/blogs/blogs-repository";
import {BloggerViewType, CreateBloggerDto} from "../types/blogsTypes";
import {PostsRepository} from "../repositories/posts/posts-repository";
import {inject, injectable} from "inversify";
import {LikesRepository} from "../repositories/like-repoository";

@injectable() // добавить
export class BlogsService {
    constructor(
        // protected bloggersRepository: BloggersRepository, // проделать blogs
        @inject(BlogsRepository) protected bloggersRepository: BlogsRepository, // проделать blogs
        protected postsRepository: PostsRepository,
        protected likesRepository: LikesRepository) {
    }

    async createBlog(name: string, description: string,websiteUrl: string): Promise<BloggerViewType | null> {
        const newBlogger: CreateBloggerDto = {
            name: name,
            description: description,
            websiteUrl: websiteUrl,
            createdAt: new Date
        }
        const createdBlog = await this.bloggersRepository.createBlogger(newBlogger)
        if (createdBlog) return {
            id: createdBlog._id.toString(),
            name: createdBlog.name,
            description: createdBlog.description,
            websiteUrl: createdBlog.websiteUrl,
            createdAt: createdBlog.createdAt
        }
        return null
    }

    async updateBlog(id: string, name: string, description: string, websiteUrl: string): Promise<boolean> {
        return await this.bloggersRepository.updateBlog(id, name,description, websiteUrl)
    }

    async deleteBlog(id: string): Promise<boolean> {
        return await this.bloggersRepository.deleteBlog(id)
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
