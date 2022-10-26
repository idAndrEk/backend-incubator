import {Router} from "express";
import {
    userValidationCode,
    userValidationEmail,
    userValidationLogin,
    userValidationPassword
} from "../middlewares/User-validation";
import {allValidation} from "../middlewares/ValidationError";
import {requestInput} from "../middlewares/requestIp-middleware";
import {JwtAuthMiddleware, JwtRefreshAuthMiddleware} from "../middlewares/JwtAuth-Middleware";
import {LoginPasswordMiddleware} from "../middlewares/LoginPassword-Middleware";
import {container} from "../composition-root";
import {AuthController} from "../controllers/auth-controller";

const authController = container.resolve(AuthController)

export const authRouter = Router({})

authRouter.post('/login',
    LoginPasswordMiddleware,
    requestInput,
    authController.login.bind(authController))

authRouter.post('/logout',
    JwtRefreshAuthMiddleware,
    authController.logout.bind(authController))

authRouter.post('/refresh-token',
    JwtRefreshAuthMiddleware,
    authController.refreshToken.bind(authController))

authRouter.get('/me',
    JwtAuthMiddleware,
    authController.me.bind(authController))

authRouter.post('/registration',
    requestInput,
    userValidationLogin,
    userValidationPassword,
    userValidationEmail,
    allValidation,
    authController.registration.bind(authController))

authRouter.post('/registration-confirmation',
    requestInput,
    userValidationCode,
    allValidation,
    authController.registrationСonfirmation.bind(authController))

authRouter.post('/registration-email-resending',
    requestInput,
    userValidationEmail,
    allValidation,
    authController.registrationEmailResending.bind(authController))











