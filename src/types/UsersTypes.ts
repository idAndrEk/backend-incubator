import {ObjectId} from "mongodb";

export type UserDBPayloadType = {
    login: string
    passwordHash: string
    email: string
}

export type UserRepositoryResponseType = UserDBPayloadType & {id: string}

export type UserResponseType = {
    id: string
    login: string
    email: string
}

export type UserAccType = {
    _id: ObjectId,
    accountData: {
        userName: string,
        email: string,
        passwordHash: string,
        createdAt: Date
    },
    emailConfirmation: {
        confirmationCode: string,
        expirationDate: Date,
        isConfirmed: boolean
    }
}

export type TokenType = {
    _id: ObjectId,
    refreshToken: string
}
