import express, {Request, Response} from "express"
import cors from 'cors'
import bodyParser from "body-parser";

const app = express()

app.use(cors())
app.use(bodyParser.json())

const port = process.env.PORT || 5000

const bloggers = [
    {id: 1, name: 'IT-KAMASUTRA', youtubeUrl: 'https://www.youtube.com/c/ITKAMASUTRA'},
    {id: 2, name: 'webDev', youtubeUrl: 'https://www.youtube.com/c/YauhenKavalchuk'},
    {id: 3, name: 'Egor Malkevich', youtubeUrl: 'https://www.youtube.com/c/EgorMalkevich'},
    {id: 4, name: 'Ulbi TV', youtubeUrl: 'https://www.youtube.com/c/UlbiTV'},
]

app.get('/bloggers', (req: Request, res: Response) => {
    res.send(bloggers)
});

app.get('/bloggers/:bloggerId', (req: Request, res: Response) => {
    const id = +req.params.bloggerId;
    const blogger = bloggers.find(b => b.id === id)
    if(!blogger) {
        res.sendStatus(404).send('Not found')
    } else {
        res.json(blogger)
    }
})

app.post('/bloggers', (req: Request, res: Response) => {
        const newBlogger = {
        id: +req.body.id,
        name: req.body.name,
            youtubeUrl: req.body.youtubeUrl
    }
    bloggers.push(newBlogger)
    res.status(201).send(newBlogger)
})

app.delete('/bloggers/:id',(req: Request, res: Response)=>{
    for (let i = 0; i < bloggers.length; i++) {
        if (bloggers[i].id === +req.params.id) {
            bloggers.splice(i, 1);
            res.send(204)
            return
        }
    }
    res.send(404)
})

app.put('/bloggers/:bloggerId',(req: Request, res: Response)=>{
    const id = +req.params.bloggerId;
    const blogger = bloggers.find(n => n.id === id);
      if(blogger) {
          blogger.name = req.body.name,
              blogger.youtubeUrl = req.body.youtubeUrl
        res.send(blogger)
    } else {
        res.send(404)
    }
})

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})