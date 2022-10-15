import {SortDirection} from "../../types/paginationType";
import {BloggerViewType, PaginationBloggerType} from "../../types/bloggersTypes";
import {BloggerModelClass} from "../db";
import {injectable} from "inversify";
import {getCountPage, getSkipPage} from "../../helpers/getPage";

@injectable()

export class BlogsQueryRepository {

    async getBlogs(page: number, pageSize: number, searchNameTerm: string | null, sortBy: string, sortDirection: SortDirection): Promise<PaginationBloggerType> {
        let filter = {}
        if (searchNameTerm) {
            filter = {name: {$regex: {searchNameTerm}}}
        }
        const findBlogs = await BloggerModelClass
            .find(filter)
            .skip(getSkipPage(page, pageSize))
            .sort({[sortBy]: sortDirection === SortDirection.Asc ? 1 : -1})
            .limit(pageSize)
            .lean()
        const totalCount = await BloggerModelClass.countDocuments(filter)
        return {
            "pagesCount": getCountPage(totalCount, pageSize),
            "page": page,
            "pageSize": pageSize,
            "totalCount": totalCount,
            "items": findBlogs.map(findBlogs => ({
                id: findBlogs._id.toString(),
                name: findBlogs.name,
                youtubeUrl: findBlogs.youtubeUrl,
                createdAt: new Date
            }))
        }
    }

    async getBlog(id: string): Promise<BloggerViewType | null> {
        const blogs = await BloggerModelClass.findById(id)
        if (!blogs) return null
        return {
            id: blogs._id.toString(),
            name: blogs.name,
            youtubeUrl: blogs.youtubeUrl,
            createdAt: blogs.createdAt
        }
    }
}