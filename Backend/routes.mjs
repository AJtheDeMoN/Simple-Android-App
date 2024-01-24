import express from 'express';
import jwt from 'jsonwebtoken';
import {sendMail, createOTP, otpQueue, saveMap, alreadyMailed} from './utils.mjs';
import authenticateToken from './middleware.mjs';

const router = express.Router();

router.post('/', (req, res) => {
    console.log(otpQueue);
    // console.log(otpQueue.hasOwnProperty('hi'))
    res.send('Hello World');
});


router.post('/gen_token', (req, res) => {
    const {email} = req.body;
    
    const token = jwt.sign({email:email}, "dummy-secret", {
        expiresIn: "1h"
    });
    res.json({
        token: token
    });
})

router.post('/create_otp', (req, res) => {
    const {email} = req.body;
    const otp=createOTP();
    otpQueue[email] = {
        otp: otp,
        timestamp: Date.now()
    };
    if(alreadyMailed(email)){
        res.status(200).json({
            "message": "OTP already sent"
        });
    }
    sendMail(email, otp)
    .then((result) => {
        console.log(result);
        saveMap();
        res.status(200).json({
            "message": "OTP sent successfully"
        });
    })
    .catch((err) => {
        console.log(err);
        res.status(500).json({
            "message": "Error sending OTP"
        });
    });
})

router.post('/verify_otp', (req, res) => {
    const {email, otp} = req.body;
    const otpDetails=otpQueue[email];
    console.log("inside verify otp");
    if(!otpQueue.hasOwnProperty(email)){
        console.log('rejected')
        res.status(203).json({message:"OTP verification failed"});
    }
    else if(otpDetails.otp===otp && (Date.now()-otpDetails.timestamp)<600000){
        console.log('accepted')
        delete otpQueue[email];
        saveMap();
        res.json({message:"OTP verified successfully"});
    }else{
        console.log('rejected')
        res.status(203).json({message:"OTP verification failed"});
    }
})

router.post('/protected', authenticateToken, (req, res) => {
    res.json({
        "message": "Protected"
    });
});

export default router;

