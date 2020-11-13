"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const nodemailer_1 = __importDefault(require("nodemailer"));
const config_1 = require("../config/config");
class EmailUtil {
    constructor() {
        this.transporter = nodemailer_1.default.createTransport(config_1.config_email);
        this.mail = {
            from: config_1.config_email.auth.user,
            subject: '测试',
            to: '',
            text: ''
        };
    }
    // 发送邮件
    sendEmail(params) {
        const { email, id } = params;
        this.mail.text = `点击激活 http://${config_1.config_server.host}:${config_1.config_server.port}/api/account/activeEmail?id=${id}&email=${email}`;
        this.mail.to = email;
        console.log(this.mail);
        this.transporter.sendMail(this.mail, (error, info) => {
            if (error)
                return console.log(error);
            console.log("email send:", info.response);
        });
        this.transporter.close();
    }
}
exports.default = EmailUtil;
