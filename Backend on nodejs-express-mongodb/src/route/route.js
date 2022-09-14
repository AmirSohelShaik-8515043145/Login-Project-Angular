const express = require("express")
const { createUser, login, getUser,getUserDetails} = require("../controller/userController")
const router = express.Router()


router.post('/register', createUser)            
router.post('/login', login) 
router.get('/getuser/:email', getUser)                     
router.get('/getuser', getUserDetails) 


module.exports = router