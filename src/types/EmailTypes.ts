export type RegistrationDataType = {
    ip: string
}

export type SendEmailType = {
    sentDate: Date
}

export type EmailConfirmationType = {
    isConfirmed: boolean
    confirmationCode: string
    expirationData: Date
    sentEmails: SendEmailType[]
}