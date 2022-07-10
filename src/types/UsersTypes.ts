import {ObjectId} from "mongodb";

export type UserDBType = {
    id: ObjectId
    login: string
    passwordHash: string
}

export type UserResponseType = {
    id: ObjectId
    login: string
}