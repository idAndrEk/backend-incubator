export type PostResponseType = {
    // id: ObjectId
    id: string
    title: string
    shortDescription: string
    content: string
    bloggerId: string
    bloggerName: string

}

// export type PostTypeWithBloggerName = {
//     id: string
//     title: string
//     shortDescription: string
//     content: string
//     bloggerId: string
//     bloggerName: string
// }

export type PostPayloadType = Omit<PostResponseType, 'id'>


