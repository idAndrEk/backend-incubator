import express, {Request, Response} from "express"
import cors from 'cors'
import bodyParser from "body-parser";

const app = express()

app.use(cors())
app.use(bodyParser.json())

const port = process.env.PORT || 5000

const videos = [
    {id: 1, title: 'About JS - 01', author: 'it-incubator.eu'},
    {id: 2, title: 'About JS - 02', author: 'it-incubator.eu'},
    {id: 3, title: 'About JS - 03', author: 'it-incubator.eu'},
    {id: 4, title: 'About JS - 04', author: 'it-incubator.eu'},
    {id: 5, title: 'About JS - 05', author: 'it-incubator.eu'},
]

app.get('/videos', (req: Request, res: Response) => {
    res.send(videos)
});

app.get('/videos/:videoId', (req: Request, res: Response) => {
    const id = +req.params.videoId;
    const video = videos.find(v => v.id === id)
    if(!video) {
        res.sendStatus(404)
    } else {
        res.json(video)
    }
})

app.post('/videos', (req: Request, res: Response) => {
    let title = req.body.title
    if (!title || typeof title !== 'string' || !title.trim() || title.length > 40) {
        res.status(400).send({
            errorsMessages: [{
                    message: "maxLength 40",
                    field: "title"
                }]
        })
        return;
    }
    const newVideo = {
        id: +(new Date()),
        title: req.body.title,
        author: 'it-incubator.eu'
    }
    videos.push(newVideo)
    res.status(201).send(newVideo)
})

app.delete('/videos/:id',(req: Request, res: Response)=>{
    for (let i = 0; i < videos.length; i++) {
        if (videos[i].id === +req.params.id) {
            videos.splice(i, 1);
            res.send(204)
            return
        }
    }
    res.send(404)
})

// app.delete('/videos/:id',(req: Request, res: Response)=>{
//     const index = videos.findIndex(v => v.id === +req.params.id)
//     if (index === -1) {
//         res.send(404)
//     } else {
//         videos.splice(index, 1)
//         res.send(204)
//     }
// })

app.put('/videos/:videoId',(req: Request, res: Response)=>{
    let title = req.body.title
    if (!title || typeof title !== 'string' || !title.trim() || title.length > 40) {
        res.status(400).send({
            errorsMessages: [{
                    message: "maxLength 40",
                    field: "title"
                }]
        })
        return;
    }
    const id = +req.params.videoId;
    const video = videos.find(v => v.id === id)
    if (video) {
        video.title = req.body.title
        res.status(204).send(video)
    } else {
        res.send(404);
    }
})

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})