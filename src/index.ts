import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import {Request, Response} from 'express'
import {isNumberObject} from "util/types";

const app = express()

app.use(cors())
app.use(bodyParser.json())

const port = process.env.PORT || 5000

export const bloggers = [
    {id: 1, name: 'IT-KAMASUTRA!', youtubeUrl: 'https://www.youtube.com/c/ITKAMASUTRA'},
    {id: 2, name: 'webDev', youtubeUrl: 'https://www.youtube.com/c/YauhenKavalchuk'},
    {id: 3, name: 'Egor Malkevich', youtubeUrl: 'https://www.youtube.com/c/EgorMalkevich'},
    {id: 4, name: 'Ulbi TV', youtubeUrl: 'https://www.youtube.com/c/UlbiTV'},
]

app.get('/bloggers', (req: Request, res: Response) => {
    res.send(bloggers).sendStatus(200)
});

app.get('/bloggers/:bloggerId', (req: Request, res: Response) => {
    const id = +req.params.bloggerId;
    const blogger = bloggers.find(b => b.id === id)
    if (!blogger) {
        res.sendStatus(404).send('Not found')
    } else {
        res.json(blogger).sendStatus(200)
    }
})

app.post('/bloggers', (req: Request, res: Response) => {
    const bloggerName = req.body.name;
    const bloggerYoutubeUrl = req.body.youtubeUrl;
    const newBlogger = {id: +(new Date()), name: `${bloggerName}`, youtubeUrl: `${bloggerYoutubeUrl}`}
    const reges = RegExp('^https:\/\/([a-zA-Z0-9_-]+\.)+[a-zA-Z0-9_-]+(\/[a-zA-Z0-9_-]+)*\/?$');
    const errors = [];
     if (typeof bloggerName !== "string" || bloggerName.length > 15 || !bloggerName || bloggerName.trim() === "" ) {
        errors.push({message: 'Error name', field: 'name'})
    }
    if (bloggerYoutubeUrl.length > 100 || typeof bloggerYoutubeUrl !== "string" || !bloggerYoutubeUrl || bloggerYoutubeUrl.trim() === "" || !bloggerYoutubeUrl.match(reges)) {
        errors.push({message: 'Error youtubeUrl', field: 'youtubeUrl'})
    }
    if (errors.length) {
    res.status(400).json({
        errorsMessages: errors
    })
    } else {
        bloggers.push(newBlogger)
        res.status(201).send(newBlogger)
    }
    })

app.delete('/bloggers/:id', (req: Request, res: Response) => {
    for (let i = 0; i < bloggers.length; i++) {
        if (bloggers[i].id === +req.params.id) {
            bloggers.splice(i, 1);
            res.sendStatus(204)
            return
        }
    }
    res.sendStatus(404)
})

app.put('/bloggers/:bloggerId', (req: Request, res: Response) => {
    const errorsMessagesUpdate = [
        {
            "message": "test03",
            "field": "test04"
        }
    ]
    const nameBlogger = req.body.name;
    const youtubeUrlBlogger = req.body.youtubeUrl;
    const reges = RegExp('^https:\/\/([a-zA-Z0-9_-]+\.)+[a-zA-Z0-9_-]+(\/[a-zA-Z0-9_-]+)*\/?$');
    if (typeof nameBlogger !== "string" || nameBlogger.length > 15) {
        res.status(400).send(errorsMessagesUpdate)
    }
    if (typeof youtubeUrlBlogger !== "string" || youtubeUrlBlogger.length > 100 || !youtubeUrlBlogger.match(reges)) {
        res.status(400).send(errorsMessagesUpdate)
    } else {
        const upBlogger = bloggers.find(b => b.id === +(req.params.bloggerId))
        if (upBlogger) {
            upBlogger.name = req.body.name
            upBlogger.youtubeUrl = req.body.youtubeUrl
            res.sendStatus(204)
        } else {
            res.sendStatus(404)
        }
    }
})

export const posts = [
    {id: 1, title: 'Test01', shortDescription: 'test001', content: 'IT', bloggerId: 1, bloggerName: 'IT-KAMASUTRA'},
    {id: 2, title: 'Test02', shortDescription: 'test002', content: 'IT', bloggerId: 2, bloggerName: 'webDev'},
    {id: 3, title: 'Test03', shortDescription: 'test003', content: 'IT', bloggerId: 3, bloggerName: 'Egor Malkevich'},
    {id: 4, title: 'Test04', shortDescription: 'test004', content: 'IT', bloggerId: 4, bloggerName: 'Ulbi TV'},
]

app.get('/posts', (req: Request, res: Response) => {
    res.send(posts)
});

app.get('/posts/:postId', (req: Request, res: Response) => {
    const id = +req.params.postId;
    const post = posts.find(p => p.id === id)
    if (!post) {
        res.sendStatus(404).send('Not found')
    } else {
        res.json(post)
    }
})

app.delete('/posts/:id', (req: Request, res: Response) => {
    for (let i = 0; i < posts.length; i++) {
        if (posts[i].id === +req.params.id) {
            posts.splice(i, 1);
            res.send(204)
        }
    }
    res.send(404)
})

app.put('/posts/:postId', (req: Request, res: Response) => {
    const errors = []
    if (typeof req.body.title !== "string" || req.body.title.length > 30 || req.body.title.trim() === "") {
        errors.push({message: 'Error title', field: 'title'})
    }
    if (typeof req.body.shortDescription !== "string" || req.body.shortDescription.length > 100 || req.body.shortDescription.trim() === "") {
        errors.push({message: 'Error shortDescription', field: 'shortDescription'})
    }
    if (typeof req.body.content !== "string" || req.body.content.length > 1000 || req.body.content.trim() === "") {
        errors.push({message: 'Error content', field: 'content'})
    }
    if (errors.length) {
        res.status(400).json({
            errorsMessages: errors
        })
        return
    }
    const blogger = bloggers.find(b => b.id === req.body.bloggerId)
    if (blogger) {
        const id = +req.params.postId;
        const post = posts.find(p => p.id === id);
        if (post) {
            post.title = req.body.title,
                post.shortDescription = req.body.shortDescription,
                post.content = req.body.content,
                post.bloggerId = +req.body.bloggerId,
            res.status(204).send(post)
        } else {
            res.send(404)
        }
    } else {
        res.status(400).send({errorsMessages: [{message: "Not Found Blogger", field: "bloggerId"}]})
    }
})

app.post('/posts', (req: Request, res: Response) => {
    const errors = []
    if (typeof req.body.title !== "string" || req.body.title.length > 30 || req.body.title.trim() === "") {
        errors.push({message: 'Error title', field: 'title'})
    }
    if (typeof req.body.shortDescription !== "string" || req.body.shortDescription.length > 100 || req.body.shortDescription.trim() === "") {
        errors.push({message: 'Error shortDescription', field: 'shortDescription'})
    }
    if (typeof req.body.content !== "string" || req.body.content.length > 1000 || req.body.content.trim() === "") {
        errors.push({message: 'Error content', field: 'content'})
    }
    if (errors.length) {
        res.status(400).json({
            errorsMessages: errors
        })
        return
    }
    const blogger = bloggers.find(b => b.id === +req.body.bloggerId)
    if (blogger) {
        const newPost = {
            id: posts.length + 1,
            title: req.body.title,
            shortDescription: req.body.shortDescription,
            content: req.body.content,
            bloggerId: +req.body.bloggerId,
            bloggerName: blogger.name
        }
        posts.push(newPost)
        res.status(201).send(newPost)
    } else {
        res.status(400).send({errorsMessages: [{message: "Not Found Blogger", field: "bloggerId"}]})
    }
})

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})