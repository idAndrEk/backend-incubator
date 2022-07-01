import {postCollection, postsType} from "./db";

export const postsRepositories = {
    async allPosts(): Promise<postsType[]> {
        return postCollection.find({}).toArray()
    },

    async findPostsId(id: number): Promise<postsType | null> {
        const post: postsType | null = await postCollection.findOne({id: id})
        return post
    },

    async createPost(newPost: postsType): Promise<postsType | null> {
        const result = await postCollection.insertOne(newPost)
        return newPost
    },

    async updatePost(id: number, title: string, shortDescription: string, content: string, bloggerId: number): Promise<boolean | null> {
        const result = await postCollection.updateOne({id: id}, {
            $set: {
                title: title,
                shortDescription: shortDescription,
                content: content,
                bloggerId: bloggerId
            }
        })
        return result.matchedCount === 1
    },

    async deletePost(id: number): Promise<boolean> {
        const result = await postCollection.deleteOne({id: id})
        return result.deletedCount === 1
    }
}