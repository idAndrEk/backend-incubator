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

export const authRouter = Router({})

authRouter.post('/login',
    async (req: Request, res: Response) => {
        const user = await authService.checkCredentials(req.body.login, req.body.password)
        // console.log(user)
        if (user) {
            const token = await jwtService.createJWT(user)
            res.status(200).send({token})
        } else {
            res.sendStatus(401)
        }
    })

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
        // console.log('registration', user)
        if (user) {
            // if (user === '250') {
            res.sendStatus(204)
            return
        } else {
            res.sendStatus(400)
            return
        }
    })

authRouter.post('/registration-confirmation',
    userValidationCode,
    allValidation,
    async (req: Request, res: Response) => {
        const result = await authService.confirmEmail(req.body.code)
        if (result) {
            res.sendStatus(204)
        } else {
            res.status(400).send({errorsMessages: [{message: "Invalid confirmation code", field: "code"}]})
        }
    })

authRouter.post('/registration-email-resending',
    userValidationEmail,
    allValidation,
    async (req: Request, res: Response) => {
        const user = await usersService.findUserByEmail(req.body.email)
        if (!user) {
            res.status(400).send({errorsMessages: [{message: "Mail does not exist", field: "email"}]})
            return
        }
        if (user.emailConfirmation.isConfirmed) {
            res.status(400).send({errorsMessages: [{message: "User activated mail", field: "email"}]})
        }
        await authService.confirmNewCode(user)
        res.sendStatus(204)
    })











