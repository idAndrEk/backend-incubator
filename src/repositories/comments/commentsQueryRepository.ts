import {CommentViewType} from "../../types/commentsTypes";
import {CommentModelClass} from "../db";
import {injectable} from "inversify";
import {UserResponse, UserViewResponse} from "../../types/UsersTypes";
import {LikesRepository} from "../like-repoository";
import {log} from "util";

@injectable()
export class CommentsQueryRepository {
    constructor (protected likesRepository: LikesRepository) {}

    async getComment(id: string, user: UserResponse | undefined): Promise<CommentViewType | null> {
        const comment = await CommentModelClass.findById(id)
        if (!comment) return null
        const {likes, dislikes} = await this.likesRepository.getLikesAndDislikesCountByParentId((comment._id).toString())
        comment.likesInfo.likesCount = likes
        comment.likesInfo.dislikesCount = dislikes
        let defaultMyStatus = 'None'
        if (user) {
            defaultMyStatus = await this.likesRepository.getLikeStatusByUserId((comment._id).toString(), (user.id).toString())
        }
        comment.likesInfo.myStatus = defaultMyStatus
        return {
            id: comment._id.toString(),
            content: comment.content,
            userId: comment.userId,
            userLogin: comment.userLogin,
            createdAt: comment.createdAt,
            likesInfo: {
                likesCount: comment.likesInfo.likesCount,
                dislikesCount: comment.likesInfo.dislikesCount,
                myStatus: comment.likesInfo.myStatus
            }
        }
    }

    async checkComment(id: string): Promise<CommentViewType | null> {
        const comment = await CommentModelClass.findById(id)
        if (!comment) return null
        return {
            id: comment._id.toString(),
            content: comment.content,
            userId: comment.userId,
            userLogin: comment.userLogin,
            createdAt: comment.createdAt,
            likesInfo: {
                likesCount: comment.likesInfo.likesCount,
                dislikesCount: comment.likesInfo.dislikesCount,
                myStatus: comment.likesInfo.myStatus
            }
        }
    }
}
