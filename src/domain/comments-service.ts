import {CommentType, CommentViewType, CreateCommentDto} from "../types/commentsTypes";
import {CommentsRepository} from "../repositories/comments-repository";
import {injectable} from "inversify";
import {LikesInfo} from "../types/likeTypes";
import {LikesRepository} from "../repositories/like-repoository";
import {UserViewResponse} from "../types/UsersTypes";

@injectable()
export class CommentsService {

    constructor(protected commentsRepository: CommentsRepository, protected likesRepository: LikesRepository) {
    }

    async findCommentId(id: string, user: UserViewResponse | undefined): Promise<CommentViewType | null> {
        const comment = await this.commentsRepository.findCommentId(id)
        if (!comment) return null
        const {likes, dislikes} = await this.likesRepository.getLikesAndDislikesCountByParentId((comment._id).toString())
        comment.likesInfo.likesCount = likes
        comment.likesInfo.dislikesCount = dislikes
        let defaultMyStatus = 'None'
        if (user) {
            defaultMyStatus = await this.likesRepository.getLikeStatusByUserId((comment._id).toString(), (user._id).toString())
        }
        comment.likesInfo.myStatus = defaultMyStatus
        return {
            id: comment._id.toString(),
            content: comment.content,
            userId: comment.userId,
            userLogin: comment.userLogin,
            addedAt: comment.addedAt,
            likesInfo: {
                likesCount: comment.likesInfo.likesCount,
                dislikesCount: comment.likesInfo.dislikesCount,
                myStatus: comment.likesInfo.myStatus
            }
        }
    }

    async checkComment(id: string): Promise<CommentViewType | null> {
        const comment = await this.commentsRepository.findCommentId(id)
        if (!comment) return null
        return {
            id: comment._id.toString(),
            content: comment.content,
            userId: comment.userId,
            userLogin: comment.userLogin,
            addedAt: comment.addedAt,
            likesInfo: {
                likesCount: comment.likesInfo.likesCount,
                dislikesCount: comment.likesInfo.dislikesCount,
                myStatus: comment.likesInfo.myStatus
            }
        }

    }

    async createComment(postId: string, content: string, userId: string, userLogin: string): Promise<CommentViewType | null> {
        const newComment: CreateCommentDto = {
            postId: postId,
            content: content,
            userId: userId,
            userLogin: userLogin,
            addedAt: new Date(),
            likesInfo: {
                likesCount: 0,
                dislikesCount: 0,
                myStatus: "None"
            }
        }
        const isCommentCreate = await this.commentsRepository.creteComment(newComment)
        if (isCommentCreate) return {
            id: isCommentCreate._id.toString(),
            content: isCommentCreate.content,
            userId: isCommentCreate.userId,
            userLogin: isCommentCreate.userLogin,
            addedAt: isCommentCreate.addedAt,
            likesInfo: isCommentCreate.likesInfo
        }
        return null
    }

    async addLikeToComment(commentId: string, userId: string, login: string, likeStatus: string): Promise<boolean> {
        try {
            await this.likesRepository.addLikeOrDislikeOrNone(commentId, userId, login, likeStatus)
            return true
        } catch (e) {
            return false
        }
    }

    async updateComment(id: string, content: string): Promise<boolean | null> {
        return await this.commentsRepository.updateComment(id, content)
    }

    async deleteComment(id: string): Promise<boolean> {
        return await this.commentsRepository.deleteComment(id)
    }
}


