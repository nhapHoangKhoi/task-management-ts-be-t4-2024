"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendEmail = void 0;
const nodemailer_1 = __importDefault(require("nodemailer"));
const sendEmail = (destinationEmail, subject, content) => {
    const transporter = nodemailer_1.default.createTransport({
        service: "gmail",
        auth: {
            user: process.env.EMAIL_SOURCE,
            pass: process.env.PASSWORD_APP
        }
    });
    const mailOptions = {
        from: "nhaphk@gmail.com",
        to: destinationEmail,
        subject: subject,
        html: content
    };
    transporter.sendMail(mailOptions, function (error, info) {
        if (error) {
            console.log('Error:', error);
        }
        else {
            console.log('Email sent: ', info.response);
        }
    });
};
exports.sendEmail = sendEmail;
