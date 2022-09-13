// import bcrypt from "bcrypt";
// import {UsersRepository} from "../repositories/users-repository";
// import {UserAccType} from "../types/UsersTypes";
// import add from "date-fns/add";
// import {v4 as uuidv4} from "uuid";
// import {emailAdapter} from "../adapters/email-adapter";
// import {jwtService} from "../application/jwt-service";
// import {jwtRepository} from "../repositories/jwt-repository";
//
// export class AuthService {
//
//     async checkCredentials(login: string, password: string)/*: Promise<UserResponseType | null> */ {
//         const user = await this.usersRepository.findByLogin(login)
//         if (!user) return null
//         const result: boolean = await bcrypt.compare(password, user.accountData.passwordHash)
//         if (result) return user
//     }
//
//
//
//
//
//
//     //
//     // async checkPassword(password: string, hash: string) {
//     //     return await bcrypt.compare(password, hash)
//     // }
//
//
// }
//
//
