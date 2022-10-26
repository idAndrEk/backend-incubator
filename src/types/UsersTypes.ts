import {ObjectId} from "mongodb";

export type UserResponse = {
    id: ObjectId
    login: string
    email: string
    createdAt: Date
}

export type UserViewResponse = {
    _id: ObjectId
    login: string
}

type AccountData = {
    login: string
    email: string
    passwordHash: string
    createdAt: Date
}

type EmailConfirmation = {
    confirmationCode: string
    expirationDate: Date
    isConfirmed: boolean
}

export type UserAccType = {
    _id: ObjectId
    accountData: AccountData
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
    items: UserResponse[]
}