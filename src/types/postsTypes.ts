import {ObjectId} from "mongodb";
import {ExtendedLikesInfo} from "./likeTypes";

export type PostType = {
    _id: ObjectId
    title: string
    shortDescription: string
    content: string
    blogId: string
    bloggerName: string
    createdAt: Date
    extendedLikesInfo: ExtendedLikesInfo
}

export type PaginationPostType = {
    pagesCount: number
    page: number
    pageSize: number
    totalCount: number
    items: PostViewType[]
}

export type PostViewType = {
    id: string
    title: string
    shortDescription: string
    content: string
    blogId: string
    bloggerName: string
    createdAt: Date
    extendedLikesInfo: ExtendedLikesInfo
}

export type CreatePostDto = {
    title: string
    shortDescription: string
    content: string
    blogId: string
    bloggerName: string
    createdAt: Date
    extendedLikesInfo: ExtendedLikesInfo
}

