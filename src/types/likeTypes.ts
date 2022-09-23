import {ObjectId} from "mongodb";

// type myStatus = "None" | "Like" | "Dislike"

export type ExtendedLikesInfo = {
    likesCount: number
    dislikesCount: number
    myStatus: string
    newestLikes: NewestLikes
}

export type NewestLikes = Array<{
    addedAt: Date
    userId: string
    login: string
}>

export type LikePostCollectionType = {
    postId: ObjectId
    status: string
    createdAt: Date
    userId: ObjectId
}

export type LikeCommentCollectionType = {
    commentId: ObjectId
    status: string
    createdAt: Date
    userId: ObjectId
}

export type LikesInfo = {
    likesCount: number,
    dislikesCount: number,
    myStatus: string
}