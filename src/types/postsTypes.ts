import {ObjectId} from "mongodb";
import {ExtendedLikesInfo} from "./likeType";


export type PostType = {
    _id: ObjectId
    title: string
    shortDescription: string
    content: string
    bloggerId: string
    bloggerName: string
    extendedLikesInfo: ExtendedLikesInfo
}

export type PaginationPostType = {
    pagesCount: number
    page: number
    pageSize: number
    totalCount: number
    items: PostType[]
}

