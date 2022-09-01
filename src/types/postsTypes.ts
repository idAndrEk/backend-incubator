import {BloggerType} from "./bloggersTypes";

export type PostType = {
    id: string
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

