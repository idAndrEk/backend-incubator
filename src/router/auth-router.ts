import {jwtService} from "../application/jwt-service";
import {Router} from "express";
import {Request, Response} from "express";
import {authService} from "../domain/auth-service";


export const authRouter = Router({})


authRouter.post('/login',
    async (req: Request, res: Response) => {
        const user = await authService.validatePassword(req.body.login, req.body.password) // NAME
        if (user) {
            const token = await jwtService.createJWT(user)
            res.status(201).send({ token })
        } else {
            res.status(401)
        }
    })





// VALIDATER ID ROUTER    FOR OBJECTID      COUNT      LENGTH     !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!








// authRouter.post('/registration',
//     async (req: Request, res: Response) => {
//     const user = await authSevice.createUser(req.body.login, req.body.password)
//         res.status(201)
//         return
//     })