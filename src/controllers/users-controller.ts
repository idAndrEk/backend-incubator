import {UsersService} from "../domain/users-service";
import {Request, Response} from "express";
import {injectable} from "inversify";

@injectable()
export class UsersController {

    constructor(protected usersService : UsersService) {}

    async getUsers(req: Request, res: Response) {
        try {
            const page = req.query.PageNumber || 1
            const pageSize = req.query.PageSize || 10
            const users = await this.usersService.getUsers(+page, +pageSize)
            res.send(users)
        } catch (error) {
            console.log(error)
            return res.send('Error')
        }
    }

    async getUser(req: Request, res: Response) {
        try {
            const user = await this.usersService.getUser(req.params.id)
            if (user) {
                res.status(200).send(user)
            } else {
                res.status(404).send('Not found')
            }
        } catch (error) {
            console.log(error)
            return res.send('Error')
        }
    }

    async createUser(req: Request, res: Response) {
        try {
            const user = await this.usersService.createUser(req.body.login, req.body.email, req.body.password)
            if (user) {
                return res.status(201).send(user)
            } else {
                return res.sendStatus(401)
            }
        } catch (error) {
            console.log(error)
            return res.send('Error')
        }
    }

    async deleteUser(req: Request, res: Response) {
        try {
            const idDeletedUser = await this.usersService.deleteUserById(req.params.id) // AWAIT
            if (!idDeletedUser) {
                return res.sendStatus(404)
            } else {
                return res.sendStatus(204)
            }
        } catch (error) {
            console.log(error)
            return res.send('Error')
        }
    }
}