import express, {Request, Response} from "express";
import {bloggers} from "./blogger";
import bodyParser from "body-parser";

const app = express()

app.use(bodyParser.json())
const port = process.env.PORT || 5000

export const posts = [
    {}
]


app.get('/posts', (req: Request, res: Response) => {
    res.send(posts)
});

app.post (req: Request, res: Response) {
    const blogger = bloggers.find(b => b.id === +req.body.bloggerId)
    if (blogger) {
        const newPost = {
            id = +(newDate()),
            title = req.body.title,


            bloggerId = +req.body.bloggerId,
            bloggerName = blogger.name
        }
    } else {
        res.send(400).send(".....")
    }
}