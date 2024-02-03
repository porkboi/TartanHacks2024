const nodemailer = require('nodemailer')

const mailSender = async (email, title, body)=>{
    try {
        //to send email ->  firstly create a Transporter
        let transporter = nodemailer.createTransport({
            host:process.env.MAIL_HOST,  //-> Host SMTP detail
            port: 587,  //-> Port SMTP detail
                auth:{
                    user: process.env.MAIL_USER,  //-> User's mail for authentication
                    pass: process.env.MAIL_PASS,  //-> User's password for authentication
                }
        }) 
        //console.log("Transporter is here: ",transporter)

        //now Send e-mails to users
        let info = await transporter.sendMail({
            from: process.env.MAIL_USER,
            to:`${email}`,
                subject: `${title}`,
                html: `${body}`,
        })
        console.log("Awaiting transporter send mail")
        console.log("Info is here: ",info)
        return info

    } catch (error) {
        console.log(error.message);
    }
}

module.exports = mailSender;