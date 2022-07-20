import {ObjectId} from "mongodb";

export type UserDBType = {
    // id: ObjectId
    id: string
    login: string
    passwordHash: string
}

export type UserResponseType = {
    // id: ObjectId
    id: string
    login: string
}

export type UserPayloadType = Omit<UserResponseType, '_id'>
export type UserPayloadDbType = Omit<UserDBType, '_id'>

