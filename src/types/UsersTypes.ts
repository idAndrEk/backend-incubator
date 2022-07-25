
export type UserDBPayloadType = {
    // id: string
    login: string
    passwordHash: string
}

export type UserRepositoryResponseType = UserDBPayloadType & {id: string}

export type UserResponseType = {
    id: string
    login: string
}

// export type UserPayloadDbType = Omit<UserDBType, 'id'>



// declare global {
//     declare module "express" {
//         export interface Request {
//             user: UserResponseType | null
//         }
//     }
// }

