import {ObjectId} from "mongodb";

export type NewestLikes = Array<{
    addedAt: Date
    userId: string
    login: string
}>

// type myStatus = "None" | "Like" | "Dislike"

export type ExtendedLikesInfo = {
    likesCount: number
    dislikesCount: number
    // myStatus: myStatus
    myStatus: string
    newestLikes: NewestLikes
}

export type LikeCollectionType = {
    // _id: ObjectId
    postId: ObjectId
    status: string
    createdAt: Date
    userId: ObjectId
}