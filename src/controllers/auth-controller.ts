import {UsersService} from "../domain/users-service";
import {Request, Response} from "express";
import {jwtService} from "../composition-root";
import {injectable} from "inversify";

@injectable()
export class AuthController {

    constructor(protected usersService: UsersService) {}

    async login(req: Request, res: Response) {
        const accessToken = await this.usersService.createAccessToken(req?.user.accountData.userName)
        const refreshToken = await this.usersService.createRefreshToken(req?.user.accountData.userName)
        return res.status(200).cookie('refreshToken', refreshToken, {httpOnly: true, secure: true}).send({accessToken})
    }

    async logout(req: Request, res: Response) {
        const refreshToken = req.cookies.refreshToken
        await jwtService.logout(refreshToken)
        res.clearCookie('refreshToken')
        return res.sendStatus(204)
    }

    async refreshToken(req: Request, res: Response) {
        const accessToken = await this.usersService.createAccessToken(req?.user.accountData.userName)
        const refreshToken = await this.usersService.createRefreshToken(req?.user.accountData.userName)
        return res.status(200).cookie('refreshToken', refreshToken, {httpOnly: true, secure: true}).send({accessToken})
    }

    async me(req: Request, res: Response) {
        const user = {
            email: req.user.accountData.email,
            login: req.user.accountData.userName,
            userId: req.user.id
        }
        return res.status(200).send(user)
    }

    async registration(req: Request, res: Response) {
        const userLogin = await this.usersService.getUserByLogin(req.body.login)
        const userEmail = await this.usersService.getUserByEmail(req.body.email)
        if (userLogin) {
            return res.status(400).send({errorsMessages: [{message: "User already exists", field: "login"}]})
        }
        if (userEmail) {
            return res.status(400).send({errorsMessages: [{message: "Mail already exists", field: "email"}]})
        }
        const user = await this.usersService.createUser(req.body.login, req.body.email, req.body.password)
        if (user) {
            // if (user === '250') {
            return res.sendStatus(204)
        } else {
            return res.sendStatus(400)
        }
    }

    async registrationСonfirmation(req: Request, res: Response) {
        const result = await this.usersService.confirmEmail(req.body.code)
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
    }

    async registrationEmailResending(req: Request, res: Response) {
        const user = await this.usersService.getUserByEmail(req.body.email)
        if (!user) {
            return res.status(400).send({errorsMessages: [{message: "Mail does not exist", field: "email"}]})
        }
        if (user.emailConfirmation.isConfirmed) {
            return res.status(400).send({errorsMessages: [{message: "User activated adapters", field: "email"}]})
        }
        await this.usersService.confirmNewCode(user)
        return res.sendStatus(204)
    }
}
