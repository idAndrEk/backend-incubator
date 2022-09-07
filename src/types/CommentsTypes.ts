import {ObjectId} from "mongodb";

export type CommentType = {
    _id: ObjectId
    content: string
    userId: string
    userLogin: string
    addedAt: Date
}

export type PaginationCommentType = {
    pagesCount: number
    page: number
    pageSize: number
    totalCount: number
    items: CommentType[]
}

// export type CommentPayloadType = Omit<CommentType, 'id'>
// export type CommentResponseDBType = {
//     id: string
//     content: string
//     userId: string
//     userLogin: string
//     addedAt: string
//     postId: string
// }

