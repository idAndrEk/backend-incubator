import {ObjectId} from "mongodb";

export type PostType = {
    _id: ObjectId
    title: string
    shortDescription: string
    content: string
    bloggerId: string
    bloggerName: string
}

export type PaginationPostType = {
    pagesCount: number
    page: number
    pageSize: number
    totalCount: number
    items: PostType[]
}

