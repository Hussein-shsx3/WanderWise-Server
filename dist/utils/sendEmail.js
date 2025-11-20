"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendEmail = void 0;
const nodemailer_1 = __importDefault(require("nodemailer"));
const chalk_1 = __importDefault(require("chalk"));
const transporter = nodemailer_1.default.createTransport({
    host: process.env.EMAIL_HOST,
    port: Number(process.env.EMAIL_PORT) || 587,
    secure: false,
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
    },
});
const sendEmail = async (to, subject, html) => {
    try {
        const info = await transporter.sendMail({
            from: `"WanderWise" <${process.env.EMAIL_USER}>`,
            to,
            subject,
            html,
        });
        console.log(chalk_1.default.green(`Email sent to ${to}: ${info.messageId}`));
    }
    catch (error) {
        console.error(chalk_1.default.red(`Error sending email: ${error.message}`));
        throw error;
    }
};
exports.sendEmail = sendEmail;
