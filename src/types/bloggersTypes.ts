import {ObjectId} from "mongodb";

export type BloggerType = {
    _id: ObjectId
    name: string
    youtubeUrl: string
}

export type BloggerViewType = {
    id: string
    name: string
    youtubeUrl: string
}

export type CreateBloggerDto = {
    name: string
    youtubeUrl: string
}

export type PaginationBloggerType = {
    pagesCount: number
    page: number
    pageSize: number
    totalCount: number
    items: BloggerType[]
}


