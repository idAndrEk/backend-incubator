import {ObjectId} from "mongodb";

export type BloggerType = {
    _id: ObjectId
    name: string
    websiteUrl: string
    createdAt: Date
}

export type BloggerViewType = {
    id: string
    name: string
    websiteUrl: string
    createdAt: Date
}

export type CreateBloggerDto = {
    name: string
    websiteUrl: string
    createdAt: Date
}

export type PaginationBloggerType = {
    pagesCount: number
    page: number
    pageSize: number
    totalCount: number
    items: BloggerViewType[]
}


