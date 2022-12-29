const express = require("express")
const { createUser, login, getUser,getUserDetails, sendEmail, automatedMailSend} = require("../controller/userController")
const router = express.Router()


router.post('/register', createUser)            
router.post('/login', login) 
router.get('/getuser/:email', getUser)                     
router.get('/getuser', getUserDetails)
router.post('/sendEmail', sendEmail)
router.post('/automatedMailSend',automatedMailSend)


module.exports = router