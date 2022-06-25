import {promises} from "dns";

export const bloggers = [
    {id: 1, name: 'IT-KAMASUTRA!', youtubeUrl: 'https://www.youtube.com/c/ITKAMASUTRA'},
    {id: 2, name: 'webDev', youtubeUrl: 'https://www.youtube.com/c/YauhenKavalchuk'},
    {id: 3, name: 'Egor Malkevich', youtubeUrl: 'https://www.youtube.com/c/EgorMalkevich'},
    {id: 4, name: 'Ulbi TV', youtubeUrl: 'https://www.youtube.com/c/UlbiTV'},
]

export type bloggersType = {
    id: number
    name: string
    youtubeUrl: string
}

export const bloggersRepository = {
    async allBloggers(): Promise<bloggersType[]> {
        return bloggers
    },

    async findBloggersId(id: number): Promise<bloggersType | null> {
        const blogger = bloggers.find(b => b.id === id)
        if (!blogger) {
            return null
        } else {
            return blogger
        }
    },

    async createBlogger(name: string, youtubeUrl: string): Promise<bloggersType | undefined> {
        const newBlogger = {
            id: +(new Date()),
            name: name,
            youtubeUrl: youtubeUrl
        }

        bloggers.push(newBlogger)
        return newBlogger
        // }
    },

    async updateBlogger(id: number, name: string, youtubeUrl: string): Promise<boolean> {
        const upBlogger = bloggers.find(b => b.id === id)
        if (upBlogger) {
            upBlogger.name = name
            upBlogger.youtubeUrl = youtubeUrl
            return true
        }
        return false
    },

    async deleteBlogger(id: number): Promise<boolean> {
        for (let i = 0; i < bloggers.length; i++) {
            if (bloggers[i].id === id) {
                bloggers.splice(i, 1);
                return true
            }
        }
        return false
    }
}

