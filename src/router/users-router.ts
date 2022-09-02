import {Router, Request, Response} from "express";
import {usersService} from "../domain/users-service";
import {authMiddleware} from "../middlewares/auth-middleware";
import {
    userValidationEmail,
    userValidationLogin,
    userValidationPassword
} from "../middlewares/User-validation";
import {allValidation} from "../middlewares/Validation";

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
    authMiddleware,
    userValidationLogin,
    userValidationPassword,
    userValidationEmail,
    allValidation,
    async (req: Request, res: Response) => {
        const user = await usersService.createUser(req.body.login, req.body.email, req.body.password)
        if (user) {
            return res.status(201).send(user)
        } else {
            return res.sendStatus(401)
        }
    })

usersRouter.delete('/:id',
    authMiddleware,
    // authMiddlewareUser,
    async (req: Request, res: Response) => {
        const idDeletedUser = await usersService.deleteUserById(req.params.id) // AWAIT
        if (!idDeletedUser) {
            return res.sendStatus(404)
        } else {
            return res.sendStatus(204)
        }
    })

