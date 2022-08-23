import {jwtService} from "../application/jwt-service";
import {Router} from "express";
import {Request, Response} from "express";
import {authService} from "../domain/auth-service";
import {usersService} from "../domain/users-service";

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
    async (req: Request, res: Response) => {
        //if(findByLoginOrEmail) && if(findUserByLogin)
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









