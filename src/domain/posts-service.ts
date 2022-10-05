import {PostsRepository} from "../repositories/posts-repository";
import {CreatePostDto, PaginationPostType, PostType, PostViewType} from "../types/postsTypes";
import {CommentViewType, PaginationCommentType} from "../types/commentsTypes";
import {BloggersRepository} from "../repositories/bloggers-repository";
import {injectable} from "inversify";
import {LikesRepository} from "../repositories/like-repoository";
import {UserAccType, UserViewResponse} from "../types/UsersTypes";
import {CommentsRepository} from "../repositories/comments-repository";
import {SortBy, SortDirection} from "../types/paginationType";

@injectable()
export class PostsService {
    constructor(protected postsRepository: PostsRepository, protected bloggersRepository: BloggersRepository, protected commentsRepository: CommentsRepository, protected likesRepository: LikesRepository) {
    }

    async getPosts(page: number, pageSize: number, user: UserViewResponse | undefined): Promise<PaginationPostType> {
        const postData = await this.postsRepository.getPosts(page, pageSize)

        const pagesCount = Math.ceil(await this.postsRepository.countPost() / pageSize)
        const totalCount = await this.postsRepository.countPost()
        //TODO: ADD MAP
        /*
        const allLikes = []
            //все лайки всех постов
        //пробежать по всем лайками и засетать myStatus

            const postsWithLikes = postData.map((post) => {
                const likes = allLikes.filter((like)=> like.status === 'like' && like.parentId.toString() === post._id.toString() )
                //dislikes
                //find для myStatus
                // для newwestLike sort by addetAt
            })
*/
        let items: PostViewType[] = []
        for (let i = 0; i < postData.length; i++) {
            const post = postData[i]
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
        let post = await this.postsRepository.getPost(id)
        if (!post) return null
        return post
    }

    async createPost(title: string, shortDescription: string, content: string, blogId: string): Promise<PostViewType | null> {
        const blogger = await this.bloggersRepository.getBloggerById(blogId);
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

    async getPostComment(postId: string, page: number, pageSize: number,sortBy: SortBy, sortDirection: SortDirection/*, user: UserViewResponse | undefined*/): Promise<PaginationCommentType> {
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

