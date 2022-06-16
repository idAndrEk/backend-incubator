const bloggers = [
    {id: 1, name: 'IT-KAMASUTRA!', youtubeUrl: 'https://www.youtube.com/c/ITKAMASUTRA'},
    {id: 2, name: 'webDev', youtubeUrl: 'https://www.youtube.com/c/YauhenKavalchuk'},
    {id: 3, name: 'Egor Malkevich', youtubeUrl: 'https://www.youtube.com/c/EgorMalkevich'},
    {id: 4, name: 'Ulbi TV', youtubeUrl: 'https://www.youtube.com/c/UlbiTV'},
]

export const bloggersRepository = {
findBloggers() {
    const id = +req.params.bloggerId;
    const blogger = bloggers.find(b => b.id === id)
    if (!blogger) {
        res.sendStatus(404).send('Not found')
    } else {
        res.json(blogger).sendStatus(200)
    }
})
}
}