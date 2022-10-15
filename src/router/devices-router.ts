import {container} from "../composition-root";
import {Router} from "express";
import {DevicesController} from "../controllers/devices-controller";
import {checkUserTokenMiddleware} from "../middlewares/JwtAuth-Middleware";

const devicesController = container.resolve(DevicesController)

export const securityRouter = Router({})

securityRouter.get('/devices', checkUserTokenMiddleware, devicesController.getDevices.bind(devicesController))
// securityRouter.delete('/devices', devicesController.terminateAll.bind(authController))
// securityRouter.delete('/devices', devicesController.terminateById.bind(authController))