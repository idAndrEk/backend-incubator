// import {Request, Response, Router} from "express";
// export const posts = [
//     {id: 1, title: 'Test01', shortDescription: 'test001', content: 'IT', bloggerId: 1, bloggerName: 'IT-KAMASUTRA'},
//     {id: 2, title: 'Test02', shortDescription: 'test002', content: 'IT', bloggerId: 2, bloggerName: 'webDev'},
//     {id: 3, title: 'Test03', shortDescription: 'test003', content: 'IT', bloggerId: 3, bloggerName: 'Egor Malkevich'},
//     {id: 4, title: 'Test04', shortDescription: 'test004', content: 'IT', bloggerId: 4, bloggerName: 'Ulbi TV'},
// ]
//
// export const postsRouter = Router({})
//
//
// postsRouter.get('/', (req: Request, res: Response) => {
//     res.send(posts)
// });
// postsRouter.get('/:postId', (req: Request, res: Response) => {
//     const id = +req.params.postId;
//     const post = posts.find(p => p.id === id)
//     if (!post) {
//         res.sendStatus(404).send('Not found')
//     } else {
//         res.json(post)
//     }
// })
// postsRouter.delete('/:id', (req: Request, res: Response) => {
//     for (let i = 0; i < posts.length; i++) {
//         if (posts[i].id === +req.params.id) {
//             posts.splice(i, 1);
//             res.send(204)
//         }
//     }
//     res.send(404)
// })
// postsRouter.put('/:id', (req: Request, res: Response) => {
//     const errors = []
//     if (typeof req.body.title !== "string" || req.body.title.length > 30 || req.body.title.trim() === "") {
//         errors.push({message: 'Error title', field: 'title'})
//     }
//     if (typeof req.body.shortDescription !== "string" || req.body.shortDescription.length > 100 || req.body.shortDescription.trim() === "") {
//         errors.push({message: 'Error shortDescription', field: 'shortDescription'})
//     }
//     if (typeof req.body.content !== "string" || req.body.content.length > 1000 || req.body.content.trim() === "") {
//         errors.push({message: 'Error content', field: 'content'})
//     }
//     if (errors.length) {
//         res.status(400).json({
//             errorsMessages: errors
//         })
//         return
//     }
//     const blogger = bloggers.find(b => b.id === req.body.bloggerId)
//     if (blogger) {
//         const id = +req.params.postId;
//         const post = posts.find(p => p.id === id);
//         if (post) {
//             post.title = req.body.title,
//                 post.shortDescription = req.body.shortDescription,
//                 post.content = req.body.content,
//                 post.bloggerId = +req.body.bloggerId,
//                 res.status(204).send(post)
//         } else {
//             res.send(404)
//         }
//     } else {
//         res.status(400).send({errorsMessages: [{message: "Not Found Blogger", field: "bloggerId"}]})
//     }
// })
// postsRouter.post('/posts', (req: Request, res: Response) => {
//     const errors = []
//     if (typeof req.body.title !== "string" || req.body.title.length > 30 || req.body.title.trim() === "") {
//         errors.push({message: 'Error title', field: 'title'})
//     }
//     if (typeof req.body.shortDescription !== "string" || req.body.shortDescription.length > 100 || req.body.shortDescription.trim() === "") {
//         errors.push({message: 'Error shortDescription', field: 'shortDescription'})
//     }
//     if (typeof req.body.content !== "string" || req.body.content.length > 1000 || req.body.content.trim() === "") {
//         errors.push({message: 'Error content', field: 'content'})
//     }
//     if (errors.length) {
//         res.status(400).json({
//             errorsMessages: errors
//         })
//         return
//     }
//     const blogger = bloggers.find(b => b.id === +req.body.bloggerId)
//     if (blogger) {
//         const newPost = {
//             id: posts.length + 1,
//             title: req.body.title,
//             shortDescription: req.body.shortDescription,
//             content: req.body.content,
//             bloggerId: +req.body.bloggerId,
//             bloggerName: blogger.name
//         }
//         posts.push(newPost)
//         res.status(201).send(newPost)
//     } else {
//         res.status(400).send({errorsMessages: [{message: "Not Found Blogger", field: "bloggerId"}]})
//     }
// })