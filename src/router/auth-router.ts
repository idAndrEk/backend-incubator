// import {jwtService} from "../application/jwt-service";
// import {usersService} from "../domain/users-service";
// import {Router} from "express";
// import {Request, Response} from "express";
//
//
// export const authRouter = Router({})
//
//
// authRouter.post('/login',
//     async (req: Request, res: Response) => {
//         const checkResult = await usersService.checkCredentials(req.body.login, req.body.password)
//         if (checkResult) {
//             // const token = await jwtService.createJWT(checkResult)
//             // res.status(201).send(token)
//             res.status(201).send(checkResult)
//         } else {
//             res.status(401)
//         }
//     })





// authRouter.post('/registration',
//     async (req: Request, res: Response) => {
//     const user = await authSevice.createUser(req.body.login, req.body.password)
//         res.status(201)
//         return
//     })