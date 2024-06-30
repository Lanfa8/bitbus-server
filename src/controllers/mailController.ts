import nodemailer from 'nodemailer';

export const mailController = {
    async sendMail(content: string, subject: string, to: string) {
        const mailData = {
            from: process.env.SMTP_EMAIL_ADDRESS,
            to: to,
            subject: subject,
            text: content
        };

        console.log(process.env.SMTP_EMAIL_ADDRESS, process.env.SMTP_EMAIL_PASSWORD)

        const transporter = await this.getTransporter();
        await transporter.sendMail(mailData);

        return "Mail sent to " + to + " successfully!";
    },
    async getTransporter() {
        return nodemailer.createTransport({
            service: "hotmail",
            auth: {
                user: process.env.SMTP_EMAIL_ADDRESS,
                pass: process.env.SMTP_EMAIL_PASSWORD,
            },
        });
    }
};