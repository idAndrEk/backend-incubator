import {Router, Request, Response} from "express";
import {usersService} from "../domain/users-service";

export const usersRouter = Router({})

usersRouter.get('/',
    async (req: Request, res: Response) => {
        const page = req.query.PageNumber || 1
        const pageSize = req.query.PageSize || 10
        const users = await usersService.getAllUsers(+page, +pageSize)
        res.send(users)
    })

usersRouter.get('/:id',
    async (req: Request, res: Response) => {
        const user = await usersService.findUserById(req.params.id)
        if (user) {
            res.status(200).send(user)
        } else {
            res.status(404).send('Not found')
        }
    })

usersRouter.post('/',
    async (req: Request, res: Response) => {
        const user = await usersService.createUser(req.body.login, req.body.password)
        if (user) {
            // const token = await jwtService.createJWT(user)
            res.status(201).send(user)
            return
        } else {
            res.sendStatus(401)
        }
    })

usersRouter.delete('/:id',
    async (req: Request, res: Response) => {
        const idDeletedUser = await usersService.deleteUserById(req.params.id) // AWAIT
        if (!idDeletedUser) {
            res.sendStatus(404)
        } else {
            res.sendStatus(204)
        }
    })

