import {ObjectId} from "mongodb";

export type BloggersResponseType = {
    id: ObjectId
    name: string
    youtubeUrl: string
}

export type BloggerPayloadType = Omit<BloggersResponseType, '_id'>

export type PaginationType<T> = {
    pagesCount: number
    page: number
    pageSize: number
    totalCount: number
    items: T[]
}

// export type BloggersResponseTypeWithPagination = PaginationType<BloggersResponseType>