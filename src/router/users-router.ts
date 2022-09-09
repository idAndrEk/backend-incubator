import {Router, Request, Response} from "express";
import {usersService} from "../domain/users-service";
import {authMiddleware} from "../middlewares/auth-middleware";
import {
    userValidationEmail,
    userValidationLogin,
    userValidationPassword
} from "../middlewares/User-validation";
import {allValidation} from "../middlewares/ValidationError";
import {checkIdParamMiddleware} from "../middlewares/checkIdParam-Middleware";

export const usersRouter = Router({})

usersRouter.get('/',
    async (req: Request, res: Response) => {
        try {
            const page = req.query.PageNumber || 1
            const pageSize = req.query.PageSize || 10
            const users = await usersService.getAllUsers(+page, +pageSize)
            res.send(users)
        } catch (e) {
            return res.send('Error')
        }
    })

usersRouter.get('/:id',
    checkIdParamMiddleware,
    async (req: Request, res: Response) => {
        try {
            const user = await usersService.findUserById(req.params.id)
            if (user) {
                res.status(200).send(user)
            } else {
                res.status(404).send('Not found')
            }
        } catch (e) {
            return res.send('Error')
        }
    })

usersRouter.post('/',
    authMiddleware,
    userValidationLogin,
    userValidationPassword,
    userValidationEmail,
    allValidation,
    async (req: Request, res: Response) => {
        try {
            const user = await usersService.createUser(req.body.login, req.body.email, req.body.password)
            if (user) {
                return res.status(201).send(user)
            } else {
                return res.sendStatus(401)
            }
        } catch (e) {
            console.log(e)
            return res.send('Error')
        }
    })

usersRouter.delete('/:id',
    checkIdParamMiddleware,
    authMiddleware,
    async (req: Request, res: Response) => {
        try {
            const idDeletedUser = await usersService.deleteUserById(req.params.id) // AWAIT
            if (!idDeletedUser) {
                return res.sendStatus(404)
            } else {
                return res.sendStatus(204)
            }
        } catch (e) {
            return res.send('Error')
        }
    })

