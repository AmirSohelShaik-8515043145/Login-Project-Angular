const express = require("express")
const { createUser, login,} = require("../controller/userController")
const router = express.Router()


router.post('/register', createUser)                      // Sign up API endpoint
router.post('/login', login)                           // Sign in API endpoint




module.exports = router