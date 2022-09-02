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
import {JwtAuthMiddleware, JwtRefreshAuthMiddleware} from "../middlewares/JwtAuthMiddleware";
import {jwtService} from "../application/jwt-service";

export const authRouter = Router({})

authRouter.post('/login',
    // TODO: midleware на проверку login / password,  "isConfirmed" : false
    requestInput,
    async (req: Request, res: Response) => {
        const accessToken = await authService.createAccessToken(req.body.login)
        const refreshToken = await authService.createRefreshToken(req.body.login)
        if (!accessToken || !refreshToken) return res.status(401).send('not authorized')
        return res.status(200).cookie('refreshToken', refreshToken, {httpOnly: true, secure: true}).send({accessToken})
    })

authRouter.post('/logout',
    JwtRefreshAuthMiddleware,
    // TODO: Midl проверить refresh сущ и не валид по времени
    async (req: Request, res: Response) => {
        const refreshToken = req.cookies.refreshToken
        await jwtService.logout(refreshToken) // remov DB
        res.clearCookie('refreshToken')
        return res.sendStatus(204)
    })

authRouter.post('/refresh-token',
    JwtRefreshAuthMiddleware,
    async (req: Request, res: Response) => {
        // const userByToken = authService.findUserByLogin()
        const accessToken = await authService.createAccessToken(req.user.accountData.userName)
        const refreshToken = await authService.createRefreshToken(req.user.accountData.userName)
        return res.status(200).cookie('refreshToken', refreshToken, {httpOnly: true, secure: true}).send({accessToken})
    })

authRouter.get('/me',
    JwtAuthMiddleware,
    async (req: Request, res: Response) => {
        const user = {
            email: req.user.accountData.email,
            login: req.user.accountData.userName,
            userId: req.user.id
        }
        return res.status(200).send(user)
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
            return res.status(400).send({
                errorsMessages: [{
                    message: "Invalid confirmation code",
                    field: "code"
                }]
            })
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











