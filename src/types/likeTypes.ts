import {ObjectId, WithoutId} from "mongodb";

// type myStatus = "None" | "Like" | "Dislike"

export type ExtendedLikesInfo = {
    likesCount: number
    dislikesCount: number
    myStatus: string
    newestLikes: NewestLikes[]
}

export type NewestLikes = {
    addedAt: Date
    userId: ObjectId
    login: string
}

export type LikesType = {
    parentId: ObjectId
    status: string
    addedAt: Date
    userId: ObjectId
    login: string
}


export type LikesInfo = {
    likesCount: number,
    dislikesCount: number,
    myStatus: string
}

// export type LikePostCollectionType = {
//     postId: ObjectId
//     status: string
//     createdAt: Date
//     userId: ObjectId
// }
//
// export type LikeCommentCollectionType = {
//     commentId: ObjectId
//     status: string
//     createdAt: Date
//     userId: ObjectId
// }