import {SortDirection} from "../../types/paginationType";
import {PaginationUserType, UserAccType, UserResponse} from "../../types/UsersTypes";
import {UserModelClass} from "../db";
import {injectable} from "inversify";
import {getCountPage, getSkipPage} from "../../helpers/getPage";

@injectable()
export class UsersQueryRepository {

    async getUsers(page: number, pageSize: number, sortBy: string, sortDirection: SortDirection): Promise<PaginationUserType> {
        const usersData = await UserModelClass
            .aggregate()
            .project({
                id: '$_id',
                login: '$accountData.userName',
                email: '$accountData.email',
                createdAt: '$accountData.createdAt',
                _id: 0
            })
            .skip(getSkipPage(page, pageSize))
            .sort({[sortBy]: sortDirection === SortDirection.Asc ? 1 : -1})
            .limit(pageSize)
        const totalCount = await UserModelClass.countDocuments({})
        return {
            "pagesCount": getCountPage(totalCount, pageSize),
            "page": page,
            "pageSize": pageSize,
            "totalCount": totalCount,
            "items": usersData
        }
    }

    async getUser(id: string): Promise<UserResponse | null> {
        const user = await UserModelClass.findById(id)
        if (!user) return null
        return {
            id: user._id,
            login: user.accountData.userName,
            email: user.accountData.email,
            createdAt: user.accountData.createdAt
        }
    }
}