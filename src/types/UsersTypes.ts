import {ObjectId} from "mongodb";

export type UsersTypes = {
    id: ObjectId
    login: string
    passwordHash: string
}

export type UsersTypesPassword = {
    id: ObjectId
    login: string
}