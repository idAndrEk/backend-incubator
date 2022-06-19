
export const posts = [
    {id: 1, title: 'IT-KAMASUTRA', shortDescription: 'test001', content: 'IT', bloggerId: 1, bloggerName: 'IT-KAMASUTRA'},
    {id: 2, title: 'webDev', shortDescription: 'test002', content: 'IT', bloggerId: 2, bloggerName: 'webDev'},
    {id: 3, title: 'Egor Malkevich', shortDescription: 'test003', content: 'IT', bloggerId: 3, bloggerName: 'Egor Malkevich'},
    {id: 4, title: 'Ulbi TV', shortDescription: 'test004', content: 'IT', bloggerId: 4, bloggerName: 'Ulbi TV'},
]

export  const postsRepositories = {
    allPosts() {
        return posts
    },

    findPostsId(id: number) {
        const post = posts.find(p => p.id === id)
        if (!post) {
            return false
        } else {
            return post
        }
    },

    createPost(title: string, shortDescription: string, content: string, bloggerId: number, bloggerName: string) {
        const newPost = {
            id: posts.length + 1,
            title: title,
            shortDescription: shortDescription,
            content: content,
            bloggerId: bloggerId,
            bloggerName: bloggerName
            }
            posts.push(newPost)
            return newPost
    },

    updatePost(id: number, title: string, shortDescription: string, content: string, bloggerId: number) {
        const upPost = posts.find(p => p.id === id);
        if (upPost) {
            upPost.title = title,
                upPost.shortDescription = shortDescription,
                upPost.content = content,
                upPost.bloggerId = bloggerId
        } return upPost
    },

    deletePost (id: number) {
        for (let i = 0; i < posts.length; i++) {
            if (posts[i].id === id) {
                posts.splice(i, 1);
                return true
            }
        }
        return false
    }
}