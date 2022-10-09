import {CommentViewType, CreateCommentDto} from "../types/commentsTypes";
import {CommentsRepository} from "../repositories/comments/comments-repository";
import {injectable} from "inversify";
import {LikesRepository} from "../repositories/like-repoository";

@injectable()
export class CommentsService {

    constructor(protected commentsRepository: CommentsRepository, protected likesRepository: LikesRepository) {}

    async createComment(postId: string, content: string, userId: string, userLogin: string): Promise<CommentViewType | null> {
        const newComment: CreateCommentDto = {
            postId: postId,
            content: content,
            userId: userId,
            userLogin: userLogin,
            createdAt: new Date(),
            // likesInfo: {
            //     likesCount: 0,
            //     dislikesCount: 0,
            //     myStatus: "None"
            // }
        }
        const isCommentCreate = await this.commentsRepository.creteComment(newComment)
        if (isCommentCreate) return {
            id: isCommentCreate._id.toString(),
            content: isCommentCreate.content,
            userId: isCommentCreate.userId,
            userLogin: isCommentCreate.userLogin,
            createdAt: isCommentCreate.createdAt,
            // likesInfo: isCommentCreate.likesInfo
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


