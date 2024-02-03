const express = require('express')
const router = express.Router()

//Handlers from controllers
// const {login, signup, sendotp} = require("../controllers/auth")
const otpController = require('../controllers/otpController');
const authController = require('../controllers/authController');
const {auth, isStudent, isAdmin} = require('../middlewares/authMiddle')

router.post('/login', authController.login)
router.post('/signup', authController.signup)
router.post('/sendotp', otpController.sendOTP)

//testing protected route
router.get("/test",auth, (req,res)=>{
    res.json({
        success: true,
        message: "You are a valid Tester 👨‍💻"
    })
})
//protected routes
router.get('/student', auth, isStudent, (req,res)=>{
    res.json({
        success: true,
        message: "You are a valid Student 🧑‍🎓"
    })
})

router.get('/admin', auth, isAdmin, (req,res)=>{
    res.json({
        success: true,
        message: "You are a valid Admin 😎"
    })
})

module.exports = router