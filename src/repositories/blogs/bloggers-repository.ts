import {BloggerModelClass} from "../db";
import {BloggerType, CreateBloggerDto} from "../../types/bloggersTypes";
import {injectable} from "inversify";

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

    async updateBlogger(id: string, name: string, websiteUrl: string): Promise<boolean> {
        const updateResult = await BloggerModelClass.findByIdAndUpdate(id, {name, websiteUrl})
        if (updateResult) return true
        return false
    }

    async deleteBlogger(id: string): Promise<boolean> {
        const deleteResult = await BloggerModelClass.findByIdAndDelete(id)
        if (deleteResult) return true
        return false
    }

}


