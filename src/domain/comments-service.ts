import {CommentType} from "../types/CommentsTypes";
import {CommentsRepository} from "../repositories/comments-repository";
import {ObjectId} from "mongodb";
import {injectable} from "inversify";
import {LikeCommentCollectionType} from "../types/likeTypes";

@injectable()
export class CommentsService {

    constructor(protected commentsRepository: CommentsRepository) {
    }

    async findCommentId(id: string): Promise<CommentType | null> {
        return await this.commentsRepository.findCommentId(id)
    }

    async createComment(content: string, userId: string, userLogin: string, postId: string): Promise<CommentType | null> {
        const newComment = {
            _id: new ObjectId(),
            content: content,
            userId: userId,
            userLogin: userLogin,
            addedAt: new Date(),
            postId: postId,
            likesInfo: {
                likesCount: 0,
                dislikesCount: 0,
                myStatus: "None"
            }
        }
        const isCommentCreate = await this.commentsRepository.creteComment(newComment)
        if (isCommentCreate) return newComment
        return null
    }

    async updateComment(id: string, content: string): Promise<boolean | null> {
        return await this.commentsRepository.updateComment(id, content)
    }

    async addLikeToComment(commentId: string, userId: string, login: string, likeStatus: string): Promise<boolean | null> {
        const likeCommentDB: LikeCommentCollectionType = {
            status: likeStatus,
            createdAt: new Date(),
            commentId: new ObjectId(commentId),
            userId: new ObjectId(userId)
        }
        const createdLike = await this.commentsRepository.addLike(likeCommentDB)
        if (createdLike) return createdLike
        return false
    }

    async deleteComment(id: string): Promise<boolean> {
        return await this.commentsRepository.deleteComment(id)
    }
}


