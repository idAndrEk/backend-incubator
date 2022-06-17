const bloggers = [
    {id: 1, name: 'IT-KAMASUTRA!', youtubeUrl: 'https://www.youtube.com/c/ITKAMASUTRA'},
    {id: 2, name: 'webDev', youtubeUrl: 'https://www.youtube.com/c/YauhenKavalchuk'},
    {id: 3, name: 'Egor Malkevich', youtubeUrl: 'https://www.youtube.com/c/EgorMalkevich'},
    {id: 4, name: 'Ulbi TV', youtubeUrl: 'https://www.youtube.com/c/UlbiTV'},
]

export const bloggersRepository = {
    // allBloggers(id: number, name: string, youtubeUrl: string) {}
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
        youtubeUrl: youtubeUrl}
    const reges = RegExp('^https:\/\/([a-zA-Z0-9_-]+\.)+[a-zA-Z0-9_-]+(\/[a-zA-Z0-9_-]+)*\/?$');
    const errors = [];
    if (typeof name !== "string" || name.length > 15 || !name || name.trim() === "" ) {
        errors.push({message: 'Error name', field: 'name'})
    }
    if (youtubeUrl.length > 100 || typeof youtubeUrl !== "string" || !youtubeUrl || youtubeUrl.trim() === "" || !youtubeUrl.match(reges)) {
        errors.push({message: 'Error youtubeUrl', field: 'youtubeUrl'})
    }
    if (errors.length) {
        return({errorsMessages: errors})
    } else {
        bloggers.push(newBlogger)
        return newBlogger
    }
},

    updateBlogger(id: number, name: string, youtubeUrl: string) {
        const reges = RegExp('^https:\/\/([a-zA-Z0-9_-]+\.)+[a-zA-Z0-9_-]+(\/[a-zA-Z0-9_-]+)*\/?$');
        const errors = [];
        if (typeof name !== "string" || name.length > 15 || !name || name.trim() === "" ) {
            errors.push({message: 'Error name', field: 'name'})
        }
        if (youtubeUrl.length > 100 || typeof youtubeUrl !== "string" || !youtubeUrl || youtubeUrl.trim() === "" || !youtubeUrl.match(reges)) {
            errors.push({message: 'Error youtubeUrl', field: 'youtubeUrl'})
        }
        if (errors.length) {
            return({errorsMessages: errors})
        } else {
            const upBlogger = bloggers.find(b => b.id === id)
            if (upBlogger) {
                upBlogger.name = name
                upBlogger.youtubeUrl = youtubeUrl
            }
            return upBlogger
            }
        }
    }

