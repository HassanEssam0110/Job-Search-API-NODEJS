import nodemailer from 'nodemailer';

export const sendMails = async ({ to = "", subject = "", html = "" } = {}) => {
    // transporter configuration.
    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: process.env.MAIL_USER,
            pass: process.env.MAIL_PASS,
        },
    });

    // message configuration.
    const info = await transporter.sendMail({
        from: '"Job Search App" <t.devmail.0110@gmail.com>',
        to,
        subject,
        html,
    });


    return info;
} 