
export type CommentResponseType = {
    id: string
    content: string
    userId: string
    userLogin: string
    addedAt: string
    // postId: string
}

// ADD DB TYPE + POSTID

export type CommentPayloadType = Omit<CommentResponseType, 'id'>
export type CommentResponseDBType = {
    id: string
    content: string
    userId: string
    userLogin: string
    addedAt: string
    postId: string
}

