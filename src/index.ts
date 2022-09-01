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
import cookieParser from "cookie-parser";

const app = express()

app.use(cors())
app.use(bodyParser.json())
app.use(cookieParser())

app.set('trust proxy', true)

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




