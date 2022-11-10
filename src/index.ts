// import * as dotenv from 'dotenv'
// dotenv.config()
import express from "express";
import cors from "cors";
import {bloggersRouter} from "./router/bloggers-router";
import {postsRouter} from "./router/posts-router";
import {usersRouter} from "./router/users-router";
import {runDb} from "./repositories/db";
import {authRouter} from "./router/auth-router";
import {commentsRouter} from "./router/comments-router";
import {testingRouter} from "./router/testing-router";
import cookieParser from "cookie-parser";
import {securityRouter} from "./router/devices-router";

const app = express()
app.use(cookieParser())
app.use(cors())
app.use(express.json())

app.set('trust proxy', true)

const port = process.env.PORT || 5000

app.use('/blogs', bloggersRouter)
app.use('/posts', postsRouter)
app.use('/users', usersRouter)
app.use('/auth', authRouter)
app.use('/comments', commentsRouter)
app.use('/testing', testingRouter)
app.use('/security', securityRouter)

const startApp = async () => {
    await runDb()
    app.listen(port, () => {
        console.log(`Example app listening on port ${port}`)
    })
}

startApp()




