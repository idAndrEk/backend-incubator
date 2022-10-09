export const getSkipPage = (page: number, pageSize: number) => {
   return (page - 1) * pageSize
}

export const getCountPage = (totalCount: number , pageSize: number) => {
   return Math.ceil(totalCount / pageSize)
}