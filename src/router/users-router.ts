import {Router, Request, Response} from "express";
import {usersService} from "../domain/users-service";
import {jwtService} from "../application/jwt-service";

export const usersRouter = Router({})

usersRouter.get('/',
    async (req: Request, res: Response) => {
        const page = req.query.PageNumber || 1
        const pageSize = req.query.PageSize || 10
        const users = await usersService.getAllUsers(+page, +pageSize)
        res.send(users)
    })

usersRouter.post('/',
    async (req: Request, res: Response) => {
        const user = await usersService.createUser(req.body.login, req.body.password)
        if (user) {
            const token = await jwtService.createJWT(user)
            res.status(201).send(user)
            return
        } else {
            res.sendStatus(401)
        }
    })


