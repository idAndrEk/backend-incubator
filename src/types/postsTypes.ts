export type PostResponseType = {
    id: string
    title: string
    shortDescription: string
    content: string
    bloggerId: string
    bloggerName: string

}

export type PostPayloadType = Omit<PostResponseType, 'id'>


