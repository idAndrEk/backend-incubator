// export const posts = [
//     {
//         id: 1,
//         title: 'IT-KAMASUTRA!!!',
//         shortDescription: 'test001',
//         content: 'IT',
//         bloggerId: 1,
//         bloggerName: 'IT-KAMASUTRA'
//     },
//     {id: 2, title: 'webDev', shortDescription: 'test002', content: 'IT', bloggerId: 2, bloggerName: 'webDev'},
//     {
//         id: 3,
//         title: 'Egor Malkevich',
//         shortDescription: 'test003',
//         content: 'IT',
//         bloggerId: 3,
//         bloggerName: 'Egor Malkevich'
//     },
//     {id: 4, title: 'Ulbi TV', shortDescription: 'test004', content: 'IT', bloggerId: 4, bloggerName: 'Ulbi TV'},
// ]

import {postCollection, postsType} from "./db";

export const postsRepositories = {
    async allPosts(): Promise<postsType[]> {
        return postCollection.find({}).toArray()
    },

    async findPostsId(id: number): Promise<postsType | null> {
        const post: postsType | null = await postCollection.findOne({id: id})
        return post
    },

    async createPost(newPost: postsType): Promise<postsType | undefined> {
        const result = await postCollection.insertOne(newPost)
        return newPost
    },

    async updatePost(id: number, title: string, shortDescription: string, content: string, bloggerId: number): Promise<boolean | undefined> {
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