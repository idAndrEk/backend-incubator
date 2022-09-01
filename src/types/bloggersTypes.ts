export type BloggerType = {
    id: string
    name: string
    youtubeUrl: string
}

export type PaginationType<T> = {
    pagesCount: number
    page: number
    pageSize: number
    totalCount: number
    items: T[]
}

export type PaginationBloggerType = {
    pagesCount: number
    page: number
    pageSize: number
    totalCount: number
    items: BloggerType[]
}


