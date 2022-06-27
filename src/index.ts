import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import {bloggersRouter} from "./router/bloggers-router";
import {postsRouter} from "./router/posts-router";
import {runDb} from "./repositories/db";
import {envSetting} from "./env_setting";

const app = express()

app.use(cors())
app.use(bodyParser.json())

const port = envSetting.PORT

app.use('/bloggers', bloggersRouter)
app.use('/posts', postsRouter)

const startApp = async () => {
    await runDb()
    app.listen(port, () => {
        console.log(`Example app listening on port ${port}`)
    })
}

startApp()