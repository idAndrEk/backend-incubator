import {injectable} from "inversify";
import {LikesModelClass} from "./db";
import {ObjectId} from "mongodb";

@injectable()
export class LikesRepository {
    async addLikeOrDislikeOrNone(parentId: string, userId: string, login: string, status: string) {
        await LikesModelClass.findOneAndUpdate({parentId, userId}, {status, addedAt: new Date(), login}, {upsert: true})
        return
    }

    async getLikesAndDislikesCountByParentId(parentId: string) {
        const likes = await LikesModelClass.countDocuments({parentId, status: 'Like'})
        const dislikes = await LikesModelClass.countDocuments({parentId, status: 'Dislike'})
        return {likes, dislikes}
    }

    async getLikeStatusByUserId(parentId: string, userId: string) {
        const result = await LikesModelClass.findOne({parentId, userId})
        if (result) return result.status
        return 'None'
    }

    async getNewestLikesByParentId(parentId: string, count: number) {
        const newestLikes = await LikesModelClass.find({parentId, status: 'Like'})
            .sort({'addedAt': 1})
            .limit(count)
            .select({id: false, parentId: false, status: false})
            .lean()
        return newestLikes
    }
}

