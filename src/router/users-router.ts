import {Router} from "express";
import {authMiddleware} from "../middlewares/auth-middleware";
import {userValidationEmail, userValidationLogin, userValidationPassword} from "../middlewares/User-validation";
import {allValidation} from "../middlewares/ValidationError";
import {checkIdParamMiddleware} from "../middlewares/checkIdParam-Middleware";
import {container} from "../composition-root";
import {UsersController} from "../controllers/users-controller";

const usersController = container.resolve(UsersController)

export const usersRouter = Router({})

usersRouter.get('/', usersController.getUsers.bind(usersController))
usersRouter.get('/:id', checkIdParamMiddleware, usersController.getUser.bind(usersController))
usersRouter.post('/', authMiddleware, userValidationLogin, userValidationPassword, userValidationEmail, allValidation, usersController.createUser.bind(usersController))
usersRouter.delete('/:id', checkIdParamMiddleware, authMiddleware, usersController.deleteUser.bind(usersController))

