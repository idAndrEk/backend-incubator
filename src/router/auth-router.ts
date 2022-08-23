import {jwtService} from "../application/jwt-service";
import {Router} from "express";
import {Request, Response} from "express";
import {authService} from "../domain/auth-service";
import {usersService} from "../domain/users-service";
import {userValidation} from "../middlewares/User-validation";
import {allValidation} from "../middlewares/Validation";
import {usersRepository} from "../repositories/users-repository";

export const authRouter = Router({})

authRouter.post('/login',
    async (req: Request, res: Response) => {
        const user = await authService.checkCredentials(req.body.login, req.body.password)
        console.log(user)
        if (user) {
            const token = await jwtService.createJWT(user)
            res.status(200).send({token})
        } else {
            res.sendStatus(401)
        }
    })

authRouter.post('/registration',
    userValidation,
    allValidation,
    async (req: Request, res: Response) => {
        const userLogin = await usersRepository.findByLogin(req.body.login)
        const userEmail = await usersRepository.findOrEmail(req.body.email)
        if (userLogin) {
            return res.status(400).send({errorsMessages: [{message: "USER", field: "login"}]})
        }
        if (userEmail) {
            return res.status(400).send({errorsMessages: [{message: "EMAIL", field: "login"}]})
        }
        const user = await usersService.createUser(req.body.login, req.body.email, req.body.password)
        if (user === '250') {
            res.sendStatus(204)
            return
        } else {
            res.sendStatus(400)
            return
        }
    })

authRouter.post('/confirm-email',
    async (req: Request, res: Response) => {
        const result = await authService.confirmEmail(req.body.code)
        if (result) {
            res.sendStatus(201)
        } else {
            res.sendStatus(400)
        }
    })

authRouter.post('/resend-registration-code',
    async (req: Request, res: Response) => {
        const result = await authService.confirmEmail(req.body.code)
    })


// VALIDATER ID ROUTER    FOR OBJECTID      COUNT      LENGTH     !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!









