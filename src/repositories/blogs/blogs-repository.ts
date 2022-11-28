import {BloggerModelClass} from "../db";
import {BloggerType, CreateBloggerDto} from "../../types/blogsTypes";
import {injectable} from "inversify";

@injectable()
export class BlogsRepository {

    async createBlogger(newBlogger: CreateBloggerDto): Promise<BloggerType | null> {
        try {
            const bloggerInstance = new BloggerModelClass(newBlogger);
            await bloggerInstance.save()
            return bloggerInstance
        } catch (e) {
            return null
        }
    }

    async updateBlog(id: string, name: string, description:string, websiteUrl: string): Promise<boolean> {
        const updateResult = await BloggerModelClass.findByIdAndUpdate(id, {name,description, websiteUrl})
        if (updateResult) return true
        return false
    }

    async deleteBlog(id: string): Promise<boolean> {
        const deleteResult = await BloggerModelClass.findByIdAndDelete(id)
        if (deleteResult) return true
        return false
    }

}


