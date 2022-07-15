export type BloggersResponseType = {
    // id: number
    id: string
    name: string
    youtubeUrl: string
}

export type BloggerPayloadType<T> = Omit<BloggersResponseType, '_id'>

export type PaginationType<T> = {
    pagesCount: number
    page: number
    pageSize: number
    totalCount: number
    items: T[]
}

// export type BloggersResponseTypeWithPagination = PaginationType<BloggersResponseType>