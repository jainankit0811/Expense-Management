import dotenv from 'dotenv';
import nodemailer from 'nodemailer';
dotenv.config();

const transporter = nodemailer.createTransport({
    service: "Gmail",
    port: process.env.SMTP_PORT,
    secure: true,
    auth: {
        user: process.env.SMTP_EMAIL,
        pass: process.env.SMTP_PASSWORD,
    },
});

export const sendOtpMail = async (email, otp) => {
    await transporter.sendMail({
        from: process.env.FROM_EMAIL,
        to: email,
        subject: 'Your OTP Code',
        text: `Your OTP code is <b>${otp}<b>. It is valid for 10 minutes.`,
    });

};

