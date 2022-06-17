import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import {Request, Response} from 'express'
import {isNumberObject} from "util/types";
import {bloggersRouter} from "./router/bloggers-router";
// import {postsRouter} from "./router/posts-router";

const app = express()

app.use(cors())
app.use(bodyParser.json())

const port = process.env.PORT || 5000


app.use('/bloggers', bloggersRouter)
// app.use('/posts', postsRouter)

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})