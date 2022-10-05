import {ObjectId} from "mongodb";
import {LikesInfo} from "./likeTypes";

export type CommentType = {
    _id: ObjectId
    postId: string
    content: string
    userId: string
    userLogin: string
    createdAt: string
    likesInfo: LikesInfo
}

export type CommentViewType = {
    id: string
    content: string
    userId: string
    userLogin: string
    createdAt: string
    // likesInfo: LikesInfo
}

export type CreateCommentDto = {
    postId: string
    content: string
    userId: string
    userLogin: string
    createdAt: string
    // likesInfo: LikesInfo
}

export type PaginationCommentType = {
    pagesCount: number
    page: number
    pageSize: number
    totalCount: number
    items: CommentViewType[]
}

