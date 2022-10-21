import {container} from "../composition-root";
import {Router} from "express";
import {DevicesController} from "../controllers/devices-controller";

const devicesController = container.resolve(DevicesController)

export const securityRouter = Router({})

securityRouter.get('/devices',
    devicesController.getDevices.bind(devicesController))

securityRouter.delete('/devices',
    devicesController.deleteSessions.bind(devicesController))

securityRouter.delete('/devices/:id',
    devicesController.deleteSession.bind(devicesController))