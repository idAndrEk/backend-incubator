import nodemailer from 'nodemailer';

export const emailAdapter = {
    async sendEmailConfirmationMessage(code: string, email: string) {
        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: 'backandreysam@gmail.com',
                pass: 'wxrizdtexhlcstlz'
            },
        });
        const result = await transporter.sendMail({
            from: 'Andrey',
            to: email,
            subject: 'Account verified',
            text: `https://somesite.com/confirm-email?code=${code}`
        })
        return result
    },

    async sendEmailRecoveryMessage(code: string, email: string) {
        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: 'backandreysam@gmail.com',
                pass: 'wxrizdtexhlcstlz'
            },
        });
        const result = await transporter.sendMail({
            from: 'Andrey',
            to: email,
            subject: 'Recovery code',
            html: `<h1>Password recovery</h1>
                   <p>To finish password recovery please follow the link below:
                   <a href='https://somesite.com/password-recovery?recoveryCode=${code}'>recovery password</a></p>`
        })
        return result

    }
}

