export type UserType = {
    id: string
    login: string
    email: string
}
export type UserDto = {
    id: string
    login: string
}

type AccountData = {
    userName: string,
    email: string,
    passwordHash: string,
    createdAt: Date
}

type EmailConfirmation = {
    confirmationCode: string,
    expirationDate: Date,
    isConfirmed: boolean
}

export type UserAccType = {
    id: string,
    accountData: AccountData,
    emailConfirmation: EmailConfirmation
}

export type TokenType = {
    refreshToken: string
}

export type PaginationUserType = {
    pagesCount: number
    page: number
    pageSize: number
    totalCount: number
    items: UserDto[]
}