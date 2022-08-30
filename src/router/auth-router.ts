import {jwtService} from "../application/jwt-service";
import {Router} from "express";
import {Request, Response} from "express";
import {authService} from "../domain/auth-service";
import {usersService} from "../domain/users-service";
import {
    userValidationCode,
    userValidationEmail,
    userValidationLogin,
    userValidationPassword
} from "../middlewares/User-validation";
import {allValidation} from "../middlewares/Validation";
import {usersRepository} from "../repositories/users-repository";
import {requestInput} from "../middlewares/requestIp-middleware";
import {stat} from "fs";

export const authRouter = Router({})

authRouter.post('/login',
    requestInput,
    async (req: Request, res: Response) => {
        const user = await authService.checkCredentials(req.body.login, req.body.password)
        if (user) {
            const token = await jwtService.generateToken(user)
            return res.status(200).send({token})
        } else {
            return res.status(401).send('not authorized')
        }
    })

authRouter.post('/logout',
    async (req: Request, res: Response) => {
        const {refreshToken} = req.cookies
        const token = await usersService.logout(refreshToken)
        res.clearCookie('refreshToken')
        console.log(token)
        return res.status(204).send(token)
    })

//refresh после валидности отправлять в bd (~black list) (обновить) + logout (зачистить)

authRouter.post('/registration',
    requestInput,
    userValidationLogin,
    userValidationPassword,
    userValidationEmail,
    allValidation,
    async (req: Request, res: Response) => {
        const userLogin = await usersService.findUserByLogin(req.body.login)
        const userEmail = await usersRepository.findByEmail(req.body.email)
        if (userLogin) {
            return res.status(400).send({errorsMessages: [{message: "User already exists", field: "login"}]})
        }
        if (userEmail) {
            return res.status(400).send({errorsMessages: [{message: "Mail already exists", field: "email"}]})
        }
        const user = await usersService.createUser(req.body.login, req.body.email, req.body.password)
        if (user) {
            // if (user === '250') {
            return res.sendStatus(204)
        } else {
            return res.sendStatus(400)
        }
    })

authRouter.post('/registration-confirmation',
    requestInput,
    userValidationCode,
    allValidation,
    async (req: Request, res: Response) => {
        const result = await authService.confirmEmail(req.body.code)
        if (result) {
            return res.sendStatus(204)
        } else {
            return res.status(400).send({errorsMessages: [{message: "Invalid confirmation code", field: "code"}]})
        }
    })

authRouter.post('/registration-email-resending',
    requestInput,
    userValidationEmail,
    allValidation,
    async (req: Request, res: Response) => {
        const user = await usersService.findUserByEmail(req.body.email)
        if (!user) {
            return res.status(400).send({errorsMessages: [{message: "Mail does not exist", field: "email"}]})
        }
        if (user.emailConfirmation.isConfirmed) {
            return res.status(400).send({errorsMessages: [{message: "User activated mail", field: "email"}]})
        }
        await authService.confirmNewCode(user)
        return res.sendStatus(204)
    })











