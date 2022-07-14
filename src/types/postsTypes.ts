import {ObjectId} from "mongodb";

export type PostsType = {
    id: ObjectId
    title: string
    shortDescription: string
    content: string
    bloggerId: string
    bloggerName: string
}

export type PostPayloadType = Omit<PostsType, '_id'>

