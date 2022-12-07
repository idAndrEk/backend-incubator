import {ObjectId, WithoutId} from "mongodb";
import {UserAccType} from "./UsersTypes";
import {PaginationPostType, PostType} from "./postsTypes";

// type myStatus = "None" | "Like" | "Dislike"

export type ExtendedLikesInfo = {
    likesCount: number
    dislikesCount: number
    myStatus: string
    newestLikes: NewestLikes[]
}

export type NewestLikes = {
    addedAt: Date
    userId: ObjectId
    login: string
}

export type LikesType = {
    parentId: ObjectId
    status: string
    addedAt: Date
    userId: ObjectId
    login: string
}


export type LikesInfo = {
    likesCount: number,
    dislikesCount: number,
    myStatus: string
}

// async getPosts(page: number, pageSize: number, user: UserAccType | undefined): Promise<PaginationPostType> {
//     const postData = await this.postsRepository.getPosts(page, pageSize)
//     // console.log('POST DATA', postData)
//     const pagesCount = Math.ceil(await this.postsRepository.countPost() / pageSize)
//     const totalCount = await this.postsRepository.countPost()
//
//     let likes = []
//
//     let items: PostType[] = []
// for (let i = 0; i < postData.length; i++) {
//     const post = postData[i]
//     const {likes, dislikes} = await this.likesRepository.getLikesAndDislikesCountByParentId((post._id).toString())
//     post.extendedLikesInfo.likesCount = likes
//     post.extendedLikesInfo.dislikesCount = dislikes
//     const myStatus = await this.likesRepository.getLikeStatusByUserId((post._id).toString(), (user!._id).toString())
//     const newestLikes = await this.likesRepository.getNewestLikesByParentId((post._id).toString(), 3)
//     items.push({
//         id: post._id.toString(),
//         title: post.title,
//         shortDescription: post.shortDescription,
//         content: post.content,
//         blogId: post.blogId,
//         bloggerName: post.bloggerName,
//         createdAt: post.createdAt,
//         extendedLikesInfo: {
//             likesCount: likes,
//             dislikesCount: dislikes,
//             myStatus,
//             newestLikes
//         }
//     })
//
// }
// return {
//     pagesCount: pagesCount,
//     page: page,
//     pageSize: pageSize,
//     totalCount: totalCount,
//     // 'items': postData
//     items
// }
// }
