import nodemailer from 'nodemailer';
import fs from 'fs';

// Mail Setup
export const transporter = nodemailer.createTransport({
    host: 'enter host name',
    port: 2525,
    secure: false,
    auth: {
        user: 'your email',
        pass: 'password'
    }
});

export const sendMail = (email, otp) => {
    return new Promise((resolve, reject) => {
        const mailOptions = {
            from: 'your email',
            to: email,
            subject: 'OTP for Verification',
            text: `Your OTP for verification is: ${otp}, valid for 10 minutes. Do not share it with anyone.`,
        };
        transporter.sendMail(mailOptions)
        .then((result) => {
            console.log('Email sent: ' + result.response)
            resolve({status: 200, message: 'Email sent'})
        })
        .catch((err) =>{
            console.log(err)
            reject({status: 500, message: 'Error sending email'})
        });
    })
}

// OTP Setup
export const createOTP = () => {
    return Math.floor(100000 + Math.random() * 900000);
}
export const otpQueue = {};
export const saveMap = () => {
    const data=JSON.stringify(otpQueue);
    fs.writeFileSync('otp.json', data);
}
export const retrieveMap = () => {
    if(!fs.existsSync('otp.json')){
        return;
    }
    const data=fs.readFileSync('otp.json', 'utf-8');
    for(const [key, value] of Object.entries(JSON.parse(data))){
        otpQueue[key]=value;
    }
}

export const alreadyMailed = (email) => {
    if(otpQueue.hasOwnProperty(email)){
        return false;
    }
    else if (otpQueue[email] && (Date.now()-otpQueue[email].timestamp)<600000){
        return true;
    }
    else{
        delete otpQueue[email];
        saveMap();
        return false;
    }
}
