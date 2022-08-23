import nodemailer from 'nodemailer';

export const emailsManager = {
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
        // if (250) {
        //     console.log(result.response) // if 250 => OK
        //     return (result.response).split(' ')[0]
        // }
    }
}

