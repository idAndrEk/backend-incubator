import {BloggerModelClass, PostModelClass} from "../db";
import {BloggerType, CreateBloggerDto} from "../../types/bloggersTypes";
import {PostType} from "../../types/postsTypes";
import {injectable} from "inversify";
import {SortDirection} from "../../types/paginationType";

@injectable()
export class BloggersRepository {

    async createBlogger(newBlogger: CreateBloggerDto): Promise<BloggerType | null> {
        try {
            const bloggerInstance = new BloggerModelClass(newBlogger);
            await bloggerInstance.save()
            return bloggerInstance
        } catch (e) {
            return null
        }
    }

    async updateBlogger(id: string, name: string, youtubeUrl: string): Promise<boolean> {
        const updateResult = await BloggerModelClass.findByIdAndUpdate(id, {name, youtubeUrl})
        if (updateResult) return true
        return false
    }

    async deleteBlogger(id: string): Promise<boolean> {
        const deleteResult = await BloggerModelClass.findByIdAndDelete(id)
        if (deleteResult) return true
        return false
    }

}


