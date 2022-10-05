export type PaginationType = {
    pagesCount: number
    pageNumber: number
    pageSize: number
    sortBy: string
    sortDirection: SortDirection
    totalCount: number
}

export enum SortDirection {
    Asc = 'asc',
    Desc = 'desc'
}