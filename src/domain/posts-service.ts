import {PostsRepository} from "../repositories/posts/posts-repository";
import {CreatePostDto, PaginationPostType, PostType, PostViewType} from "../types/postsTypes";
import {CommentViewType, PaginationCommentType} from "../types/commentsTypes";
import {BlogsRepository} from "../repositories/blogs/blogs-repository";
import {injectable} from "inversify";
import {LikesRepository} from "../repositories/like-repoository";
import {UserViewResponse} from "../types/UsersTypes";
import {CommentsRepository} from "../repositories/comments/comments-repository";
import {SortDirection} from "../types/paginationType";
import {BlogsQueryRepository} from "../repositories/blogs/blogsQueryRepository";

@injectable()
export class PostsService {
    constructor(protected postsRepository: PostsRepository,
                protected bloggersRepository: BlogsRepository,
                protected commentsRepository: CommentsRepository,
                protected likesRepository: LikesRepository,
                protected blogsQueryRepository: BlogsQueryRepository) {}

    async createPost(title: string, shortDescription: string, content: string, blogId: string): Promise<PostViewType | null> {
        const blogger = await this.blogsQueryRepository.getBlog(blogId);
        if (!blogger) return null
        const newPost: CreatePostDto = {
            title: title,
            bloggerName: blogger.name,
            shortDescription: shortDescription,
            content: content,
            blogId: blogId,
            createdAt: new Date(),
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
            blogId: createdPost.blogId,
            createdAt: createdPost.createdAt,
            extendedLikesInfo: {
                likesCount: 0,
                dislikesCount: 0,
                myStatus: 'None',
                newestLikes: []
            }
        }
        return null
    }

    async updatePost(id: string, title: string, shortDescription: string, content: string, blogId: string): Promise<boolean | null> {
        return await this.postsRepository.updatePost(id, title, shortDescription, content, blogId)
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

    async getPostComment(postId: string, page: number, pageSize: number, sortBy: string, sortDirection: SortDirection/*, user: UserViewResponse | undefined*/): Promise<PaginationCommentType> {
        const commentData = await this.commentsRepository.findPostComment(postId, page, pageSize, sortBy, sortDirection);
        const totalCount = await this.commentsRepository.countPostComment(postId);
        const pagesCount = Math.ceil(await this.commentsRepository.countPostComment(postId) / pageSize);
        let items: CommentViewType[] = []
        for (const comment of commentData) {
            // const {
            //     likes,
            //     dislikes
            // } = await this.likesRepository.getLikesAndDislikesCountByParentId((comment._id).toString())
            // comment.likesInfo.likesCount = likes
            // comment.likesInfo.dislikesCount = dislikes
            // let myStatus = !user ? 'None' : await this.likesRepository.getLikeStatusByUserId((comment._id).toString(), (user._id).toString())
            // comment.likesInfo.myStatus = myStatus
            items.push({
                id: comment._id.toString(),
                content: comment.content,
                userId: comment.userId,
                userLogin: comment.userLogin,
                createdAt: comment.createdAt,
                // likesInfo: {
                //     likesCount: comment.likesInfo.likesCount,
                //     dislikesCount: comment.likesInfo.dislikesCount,
                //     myStatus
                // }
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

