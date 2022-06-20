export const bloggers = [
    {id: 1, name: 'IT-KAMASUTRA!', youtubeUrl: 'https://www.youtube.com/c/ITKAMASUTRA'},
    {id: 2, name: 'webDev', youtubeUrl: 'https://www.youtube.com/c/YauhenKavalchuk'},
    {id: 3, name: 'Egor Malkevich', youtubeUrl: 'https://www.youtube.com/c/EgorMalkevich'},
    {id: 4, name: 'Ulbi TV', youtubeUrl: 'https://www.youtube.com/c/UlbiTV'},
]

export const bloggersRepository = {
    allBloggers() {
        return bloggers
    },

    findBloggersId(id: number) {
    const blogger = bloggers.find(b => b.id === id)
    if (!blogger) {
        return false
    } else {
        return blogger
    }
},

    createBlogger(name: string, youtubeUrl: string) {
    const newBlogger = {
        id: +(new Date()),
        name: name,
        youtubeUrl: youtubeUrl
    }

        bloggers.push(newBlogger)
        return newBlogger
    // }
},

    updateBlogger(id: number, name: string, youtubeUrl: string) {
        const upBlogger = bloggers.find(b => b.id === id)
            if (upBlogger) {
                upBlogger.name = name
                upBlogger.youtubeUrl = youtubeUrl
            }
            return upBlogger
            },

    deleteBlogger (id:number) {
        for (let i = 0; i < bloggers.length; i++) {
            if (bloggers[i].id === id) {
                bloggers.splice(i, 1);
                return true
            }
        }
        return false
    }
}

