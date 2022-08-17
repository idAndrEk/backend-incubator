import {jwtService} from "../application/jwt-service";
import {Router} from "express";
import {Request, Response} from "express";
import {authService} from "../domain/auth-service";


export const authRouter = Router({})


authRouter.post('/login',
    async (req: Request, res: Response) => {
        const user = await authService.checkCredentials(req.body.login, req.body.password)
        // console.log(user)
        if (user) {
            const token = await jwtService.createJWT(user)
            res.status(200).send({ token }) // 201?
        } else {
            res.sendStatus(401)
        }
    })





// VALIDATER ID ROUTER    FOR OBJECTID      COUNT      LENGTH     !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!









// authRouter.post('/registration',
//     async (req: Request, res: Response) => {
//     const user = await authSevice.createUser(req.body.login, req.body.password)
//         res.status(201)
//         return
//     })
// authRouter.post('/registration',
//     async (req: Request, res: Response) => {
//     const user = await authSevice.createUser(req.body.login, req.body.password)
//         res.status(201)
//         return
//     })