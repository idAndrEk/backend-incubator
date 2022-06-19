import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import {bloggersRouter} from "./router/bloggers-router";
import {postsRouter} from "./router/posts-router";
import {authMiddleware} from "./middlewares/auth-middleware";

const app = express()

app.use(cors())
app.use(bodyParser.json())

const port = process.env.PORT || 5000

app.use(authMiddleware)
app.use('/bloggers', bloggersRouter)
app.use('/posts', postsRouter)

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})