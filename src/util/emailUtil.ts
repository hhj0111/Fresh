import nodemailer from 'nodemailer'
import { config_email,config_server } from '../config/config'


export default class EmailUtil {
    private transporter = nodemailer.createTransport(config_email)
    private mail = {
        from: config_email.auth.user,
        subject: '测试',
        to: '',
        text: ''
    }
    // 发送邮件
    public sendEmail(params) {
        const {email,id} = params
        this.mail.text = `点击激活 http://${config_server.host}:${config_server.port}/api/account/activeEmail?id=${id}&email=${email}`
        this.mail.to = email
        console.log(this.mail) 
        this.transporter.sendMail(this.mail, (error, info) => {
            if (error)
                return console.log(error)
            console.log("email send:", info.response)
        }) 
        this.transporter.close()
    }
}