import {UserRepositoryResponseType, UserResponseType} from "./UsersTypes";

declare global {
    declare namespace Express {
        export interface Request {
            user: UserResponseType | null
        }
    }
}