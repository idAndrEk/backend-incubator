import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import {bloggersRouter} from "./router/bloggers-router";
import {postsRouter} from "./router/posts-router";
import {usersRouter} from "./router/users-router";
import {runDb} from "./repositories/db";
import {authRouter} from "./router/auth-router";
import {commentsRouter} from "./router/comments-router";
import {testingRouter} from "./router/testing-router";

const app = express()

app.use(cors())
app.use(bodyParser.json())

app.set('trust proxy', true) //req.ip будет актуальный адрес

// // app.set('trust proxy', 'loopback')

// app.set('trust proxy', (ip) => {
//     if (ip === '127.0.0.1' || ip === '123.123.123.123') return true // trusted IPs
//     else return false
// })

const port = process.env.PORT || 5000

app.use('/bloggers', bloggersRouter)
app.use('/posts', postsRouter)
app.use('/users', usersRouter)
app.use('/auth', authRouter)
app.use('/comments', commentsRouter)
app.use('/testing', testingRouter)

const startApp = async () => {
    await runDb()
    app.listen(port, () => {
        console.log(`Example app listening on port ${port}`)
    })
}

startApp()




