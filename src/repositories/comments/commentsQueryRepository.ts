import {CommentViewType} from "../../types/commentsTypes";
import {CommentModelClass} from "../db";
import {injectable} from "inversify";
import {UserViewResponse} from "../../types/UsersTypes";

@injectable()
export class CommentsQueryRepository {

    async getComment(id: string, user: UserViewResponse | undefined): Promise<CommentViewType | null> {
        const comment = await CommentModelClass.findById(id)
        if (!comment) return null
        // const {likes, dislikes} = await this.likesRepository.getLikesAndDislikesCountByParentId((comment._id).toString())
        // comment.likesInfo.likesCount = likes
        // comment.likesInfo.dislikesCount = dislikes
        // let defaultMyStatus = 'None'
        // if (user) {
        //     defaultMyStatus = await this.likesRepository.getLikeStatusByUserId((comment._id).toString(), (user._id).toString())
        // }
        // comment.likesInfo.myStatus = defaultMyStatus
        return {
            id: comment._id.toString(),
            content: comment.content,
            userId: comment.userId,
            userLogin: comment.userLogin,
            createdAt: comment.createdAt,
            // likesInfo: {
            //     likesCount: comment.likesInfo.likesCount,
            //     dislikesCount: comment.likesInfo.dislikesCount,
            //     myStatus: comment.likesInfo.myStatus
            // }
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
            // likesInfo: {
            //     likesCount: comment.likesInfo.likesCount,
            //     dislikesCount: comment.likesInfo.dislikesCount,
            //     myStatus: comment.likesInfo.myStatus
            // }
        }
    }
}
