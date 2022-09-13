const userModel = require("../model/userModel")
const { isValid } = require("../validator/validator")
const bcrypt = require('bcrypt')
const moment = require("moment")
const jwt = require("jsonwebtoken")

//******************************************** Register API ***************************************************

const createUser = async (req, res) => {
    try {
        let data = req.body;
        if (Object.keys(data) == 0) { return res.status(400).send({ status: false, msg: "Bad request, No data provided." }) };

        let { username, age, email, phone, password } = data

        username = username.trim()
        for (let i = 0; i < username.length; i++) {
            if (username[i] == " ") {
                return res.status(400).send({ status: false, message: 'Provide a valid username' })
            }
        }

        if(username == "") return res.status(400).send({ status: false, message: 'Provide a valid username' })

        if (age == 0) return res.status(400).send({ status: false, message: 'Age cannot be zero' })

        data.username = username.toLowerCase()
        let duplicateUser = await userModel.findOne({ username: username })
        if (duplicateUser) return res.status(400).send({ status: false, message: 'Username is already exist' })



        let duplicateEmail = await userModel.findOne({ email: email })
        if (duplicateEmail) return res.status(400).send({ status: false, message: 'Email is already exist' })


        let duplicateNumber = await userModel.findOne({ phone: phone })
        if (duplicateNumber) return res.status(400).send({ status: false, message: 'Phone number is already exist' })

        if(password == "") return res.status(400).send({ status: false, message: 'Provide a valid password' })
        if (!(password.length >= 8 && password.length <= 15)) { return res.status(400).send({ status: false, message: "Password length should be 8 to 15 characters" }) }
        // if (!(/^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,15}$/.test(password.trim()))) { return res.status(400).send({ status: false, msg: "please provide atleast one uppercase letter ,one lowercase, one character and one number " }) }

        let securePassword = await bcrypt.hash(password, 4)
        data.password = securePassword

        data.createdAt = moment(new Date).format("Do MMMM,YYYY, h:mm a");

        let userCreated = await userModel.create(data);
        res.status(201).send({ status: true, message: "User created successfully" })
    }
    catch (error) {
        return res.status(500).send({ status: false, message: error.message })
    }
}





//******************************************** Login API ***************************************************

const login = async function (req, res) {
    try {
        const data = req.body
        const { email, password } = data

        if (Object.keys(data) == 0) return res.status(400).send({ status: false, msg: "Bad Request, No data provided" })

        if (!(/^\w+([\.-]?\w+)@\w+([\. -]?\w+)(\.\w{2,3})+$/.test(data.email.trim()))) { return res.status(400).send({ status: false, msg: "Please enter a valid Email." }) };

        if (!(/^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,15}$/.test(data.password))) { return res.status(400).send({ status: false, msg: "Email or Password is incorrect" }) }

        let user = await userModel.findOne({ email: email })
        if (!user) { return res.status(400).send({ status: false, msg: "Email or Password is incorrect" }) }
        console.log(user)

        let checkPass = user.password
        let checkUser = await bcrypt.compare(password, checkPass)
        if (checkUser == false) return res.status(400).send({ status: false, msg: "Email or Password is incorrect" })

        const token = jwt.sign({
            userId: user._id,
        }, "secret-key", { expiresIn: "120m" })
        return res.status(200).send({ status: true, msg: "You are successfully logged in" })
    }
    catch (error) {
        return res.status(500).send({ msg: error.message })
    }
}



module.exports = {
    createUser,
    login
}