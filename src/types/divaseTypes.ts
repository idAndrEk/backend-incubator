export type DevicesType = {
    ip: string
    title: string
    lastActiveDate: Date
    deviceId: string
}

export type DevicesDtoType = {
    ip: string
    title: string
    lastActiveDate: Date
    deviceId: string
    userId: string
    issuedAt: Date
    expireTime:Date
}
