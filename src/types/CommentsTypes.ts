
export type CommentResponseType = {
    id: string
    content: string
    userId: string
    userLogin: string
    addedAt: string
}

export type CommentPayloadType = Omit<CommentResponseType, 'id'>

