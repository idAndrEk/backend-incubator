import {CommentType, CommentViewType, CreateCommentDto} from "../types/commentsTypes";
import {CommentsRepository} from "../repositories/comments-repository";
import {injectable} from "inversify";
import {LikesInfo} from "../types/likeTypes";

@injectable()
export class CommentsService {

    constructor(protected commentsRepository: CommentsRepository) {
    }

    async findCommentId(id: string): Promise<CommentViewType | null> {
        const comment =  await this.commentsRepository.findCommentId(id)
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

    async createComment(content: string, userId: string, userLogin: string): Promise<CommentViewType | null> {
        const newComment: CreateCommentDto = {
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

    async updateComment(id: string, content: string): Promise<boolean | null> {
        return await this.commentsRepository.updateComment(id, content)
    }

    // async addLikeToComment(commentId: string, userId: string, login: string, likeStatus: string): Promise<boolean | null> {
    //     const likeCommentDB: LikeCommentCollectionType = {
    //         status: likeStatus,
    //         createdAt: new Date(),
    //         commentId: new ObjectId(commentId),
    //         userId: new ObjectId(userId)
    //     }
    //     const createdLike = await this.commentsRepository.addLike(likeCommentDB)
    //     if (createdLike) return createdLike
    //     return false
    // }

    async deleteComment(id: string): Promise<boolean> {
        return await this.commentsRepository.deleteComment(id)
    }
}


