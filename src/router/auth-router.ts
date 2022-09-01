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
import {jwtService} from "../application/jwt-service";
import {JwtAuthMiddleware} from "../middlewares/JwtAuthMiddleware";

export const authRouter = Router({})

authRouter.post('/login',
    requestInput,
    async (req: Request, res: Response) => {
        const accessToken = await authService.createAccessToken(req.body.login)
        const refreshToken = await authService.createRefreshToken(req.body.login)
        if (!accessToken || !refreshToken) return res.status(401).send('not authorized')
        return res.status(200).cookie('refreshToken', refreshToken, {httpOnly: true, secure: true}).send({accessToken})
    })

authRouter.post('/logout',
    async (req: Request, res: Response) => {
        const refreshToken = req.cookies
        const token = await usersService.logout(refreshToken)
        res.clearCookie('refreshToken')
        console.log(token)
        return res.status(204).send(token)
    })

authRouter.post('/refresh-token',
    async (req: Request, res: Response) => {
        //  забрали рефрешТокен из куков
        const requestRefreshToken = req.cookies.refreshToken
        console.log('requestRefreshToken', requestRefreshToken)
        // проверили был ли он там
        if (!requestRefreshToken) return res.status(401).send('no token')
        const userData = await jwtService.refresh(requestRefreshToken)
        if (userData) {
            await usersService.logout(requestRefreshToken)
            const accessToken = await authService.createAccessToken(req.user.accountData.userName)
            const refreshToken = await authService.createRefreshToken(req.user.accountData.userName)
            return res.status(200).cookie('refreshToken', refreshToken, {
                httpOnly: true,
                secure: true
            }).send({accessToken})
        }
    })

authRouter.get('/me',
    JwtAuthMiddleware,
    async (req: Request, res: Response) => {
        return res.status(200).send(req.user)
    })

// В service сделать
// проверить сам рефреш токен:
// 1. узнать что он не просрочен
// 2. достать из него логин юзера
// 3. проверить что юзер в бд
// 4. проверить что токен есть в списке разрешенных
// удалить старый requestRefreshToken

// сделал новый акцсес и решфреш (с сохранением) с сохранением
// const accessToken = await authService.createAccessToken(req.) // где???
// const refreshToken = await authService.createRefreshToken(req.) // где???
// return res.status(200).cookie('refreshToken', refreshToken, {httpOnly: true, secure: true}).send({accessToken})


authRouter.get('/',
    async (req: Request, res: Response) => {

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











