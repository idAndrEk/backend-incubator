import {ObjectId} from "mongodb";
import {ExtendedLikesInfo} from "./likeTypes";

export type PostType = {
    _id: ObjectId
    title: string
    shortDescription: string
    content: string
    bloggerId: string
    bloggerName: string
    addedAt: Date
    extendedLikesInfo: ExtendedLikesInfo
}

export type PostViewType = {
    id: string
    title: string
    shortDescription: string
    content: string
    bloggerId: string
    bloggerName: string
    addedAt: Date
    extendedLikesInfo: ExtendedLikesInfo
}

export type CreatePostDto = {
    title: string
    shortDescription: string
    content: string
    bloggerId: string
    bloggerName: string
    addedAt: Date
    extendedLikesInfo: ExtendedLikesInfo
}

export type PaginationPostType = {
    pagesCount: number
    page: number
    pageSize: number
    totalCount: number
    items: PostType[]
}

