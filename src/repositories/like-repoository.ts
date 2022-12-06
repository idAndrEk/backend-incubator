import {injectable} from "inversify";
import {LikesModelClass} from "./db";
import {ObjectId} from "mongodb";

@injectable()
export class LikesRepository {
    async addLikeOrDislikeOrNone(parentId: string, userId: string, login: string, status: string) {
        await LikesModelClass.findOneAndUpdate({parentId, userId}, {status, createdAt: new Date(), login}, {upsert: true})
        return
    }

    async getLikesAndDislikesCountByParentId(parentId: string) {
        const likes = await LikesModelClass.countDocuments({parentId, status: 'Like'})
        const dislikes = await LikesModelClass.countDocuments({parentId, status: 'Dislike'})
        return {likes, dislikes}
    }

    async getLikeStatusByUserId(parentId: string, userId: ObjectId) {
        const result = await LikesModelClass.findOne({parentId, userId})
        if (result) return result.status
        return 'None'
    }

    async getNewestLikesByParentId(parentId: string, count: number)/*: Promise <NewestLikes>*/ {
        const newestLikes = await LikesModelClass.find(
            {parentId, status: 'Like'},
            {_id: 0, __v: 0, parentId: 0, status: 0},
        )
            .sort({'createdAt': -1}) //
            .limit(count)
            .lean()
        return newestLikes
    }
}

// async getLikeStatusByParentIdsANdUserId(parentIds: string[], userId: string) {
//     const result = await LikesModelClass.findOne({
//         parentId: {$in: parentIds},
//         userId
//     })
//     if (result) return result.status
//     return 'None'
// }


















