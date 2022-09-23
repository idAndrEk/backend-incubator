import {ObjectId} from "mongodb";
import {LikesInfo} from "./likeTypes";

export type CommentType = {
    _id: ObjectId
    content: string
    userId: string
    userLogin: string
    addedAt: Date
    likesInfo: LikesInfo
}

export type PaginationCommentType = {
    pagesCount: number
    page: number
    pageSize: number
    totalCount: number
    items: CommentType[]
}

