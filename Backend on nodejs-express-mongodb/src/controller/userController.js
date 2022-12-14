const userModel = require("../model/userModel")
const { isValid } = require("../validator/validator")
const bcrypt = require('bcrypt')
const moment = require("moment")
const jwt = require("jsonwebtoken")
const nodemailer = require('nodemailer')
const XLSX = require('xlsx')
const axios = require('axios')
const readXlsxFile = require('read-excel-file/node');
const request = require('request');
const fs = require('fs');
const aws = require("../aws/aws")



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

        if (username == "") return res.status(400).send({ status: false, message: 'Provide a valid username' })

        if (age == 0) return res.status(400).send({ status: false, message: 'Age cannot be zero' })

        data.username = username.toLowerCase()
        let duplicateUser = await userModel.findOne({ username: username })
        if (duplicateUser) return res.status(400).send({ status: false, message: 'Username is already exist' })



        let duplicateEmail = await userModel.findOne({ email: email })
        if (duplicateEmail) return res.status(400).send({ status: false, message: 'Email is already exist' })


        let duplicateNumber = await userModel.findOne({ phone: phone })
        if (duplicateNumber) return res.status(400).send({ status: false, message: 'Phone number is already exist' })

        if (password == "") return res.status(400).send({ status: false, message: 'Provide a valid password' })
        if (!(password.length >= 8 && password.length <= 15)) { return res.status(400).send({ status: false, message: "Password length should be 8 to 15 characters" }) }
        // if (!(/^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,15}$/.test(password.trim()))) { return res.status(400).send({ status: false, msg: "please provide atleast one uppercase letter ,one lowercase, one character and one number " }) }

        let securePassword = await bcrypt.hash(password, 4)
        data.password = securePassword

        data.createdAt = moment(new Date).format("Do MMMM,YYYY, h:mm a");

        let userCreated = await userModel.create(data);

        res.status(201).send({ status: true, httpcode: 200, message: "User created successfully" })
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

        if (Object.keys(data) == 0) return res.status(400).send({ status: false, message: "Bad Request, No data provided" })

        // if (!(/^\w+([\.-]?\w+)@\w+([\. -]?\w+)(\.\w{2,3})+$/.test(data.email.trim()))) { return res.status(400).send({ status: false, msg: "Please enter a valid Email." }) };

        // if (!(/^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,15}$/.test(data.password))) { return res.status(400).send({ status: false, msg: "Email or Password is incorrect" }) }

        let user = await userModel.findOne({ email: email })
        if (!user) { return res.status(400).send({ status: false, message: "Email or Password is incorrect" }) }

        let checkPass = user.password
        let checkUser = await bcrypt.compare(password, checkPass)
        if (checkUser == false) return res.status(400).send({ status: false, message: "Email or Password is incorrect" })

        const token = jwt.sign({
            userId: user._id,
        }, "secret-key", { expiresIn: "120m" })
        return res.status(200).send({ status: true, message: "You are successfully logged in" })
    }
    catch (error) {
        return res.status(500).send({ message: error.message })
    }
}



const getUser = async function (req, res) {
    try {
        let Email = req.params.email

        //authentication
        // if(req.userId != paramsId){
        //     return res.status(400).send({status:false, mesaage:'Invalid user'})
        // }

        let fetchProfileData = await userModel.findOne({ email: Email })

        if (!fetchProfileData) {
            return res.status(400).send({ status: false, message: 'User not found' })
        }



        res.status(200).send({ status: true, message: 'User profile details', data: fetchProfileData })
    }
    catch (err) {
        res.status(500).send({ status: false, Error: err.message })
    }
}

const getUserDetails = async function (req, res) {
    try {
        let fetchProfileData = await userModel.find()
        let i = 0, j = fetchProfileData.length - 1;
        while (i < j) {
            let temp = fetchProfileData[i]
            fetchProfileData[i] = fetchProfileData[j]
            fetchProfileData[j] = temp
            i++;
            j--;
        }

        res.status(200).send({ status: true, message: 'User Details', data: fetchProfileData })
    }
    catch (err) {
        res.status(500).send({ status: false, message: err.message })
    }
}



const sendEmail = async (req, res) => {
    try {
        let body = req.body;
        let { TO, subject, content } = body;

        let files = req.files;
        if (Object.keys(files).length > 0){
            const fileRes = await aws.uploadFile(files[0]);
            data.profileImage = fileRes.Location;
        }
        

        let process = true;
        let mailCounter = 0;

        let successMail = 0;
        let failedMail = 0;
        let pendingArray = [];

        function sendEmail(data) {
            let options = {
                uri: "https://api-qa-pl.nprod.incred.com/v2/partner/email/send",
                method: 'POST',
                headers: {
                    'api-key': "f32e01ffae371e13a9f571f4e9db4a8fc84733fac22b1ff53929350fe5b846",
                    'Content-Type': 'application/json'
                },
                json: true,
                form: data
            };

            request(options, (body) => {
                console.log(body)
            })
        }


        readXlsxFile('/home/admin1/Documents/Practice/Login and Send Email/Login-Project-Angular/Backend on nodejs-express-mongodb/src/EDLN PL Oct 2022.xlsx').then((rows) => {
            rows.forEach(element => {

                if (process && element[0] != 'LOAN_NO' && mailCounter < 2) {

                    let mail = {
                        TO: TO,
                        SUBJECT: subject,
                        MESSAGE_BODY: content,
                        SIGNATURE: '<br><b>Thanks<br>Incred</b> ',
                        "BCC": "care@incred.com"
                    };
                    sendEmail(mail);
                }
                mailCounter++;
            });
        });


        res.status(200).send("Success")
    }
    catch (err) {
        res.status(500).send({ status: false, message: err.message })
    }
}

// const testEmailSend = (req, res) => {
//     try {
//         const transporter = nodemailer.createTransport({
//             service: 'gmail',
//             auth: {
//                 user: 'automation.user7@incred.com',
//                 pass: 'Incred@september2022$'
//             }
//         })

//         const options = {
//             from: 'amirsohel.assignment@gmail.com',
//             to: 'amirsohelsk007@gmail.com',
//             subject: 'Test Email',
//             text: 'My name Amir sohel shaik'
//         }

//         transporter.sendMail(options, (err, info) => {
//             if (err) {
//                 res.status(403).send(err)
//             }
//             res.status(200).send(info)
//         })


//         // let readXcel = excel.readFile('sample.xls')
//         // console.log(readXcel)
//         // res.send({msg :'done'})
//     }
//     catch (err) {
//         res.status(500).send({ status: false, message: err.message })
//     }
// }



const automatedMailSend = async (req, res) => {
    try {
        const reqBody = req.body
        let process = true;
        let mailCounter = 0;

        let successMail = 0;
        let failedMail = 0;
        let pendingArray = [];


        function sendEmail(data) {
            var options = {
                uri: "https://api-qa-pl.nprod.incred.com/v2/partner/email/send",
                method: 'POST',
                headers: {
                    'api-key': "f32e01ffae371e13a9f571f4e9db4a8fc84733fac22b1ff53929350fe5b846",
                    'Content-Type': 'application/json'
                },
                json: true,
                form: data
            };

            request(options, (body) => {
                console.log(body)
                if (!body.status) {
                    console.log('\nFailed : ', body.message, data.SUBJECT);
                    failedMail += 1;

                    writeFailRecord(` ` + data.SUBJECT + ' ' + body.message);
                }
                else {
                    console.log('\nSuccessful : ', data.TO);
                    successMail += 1;
                }

                console.log('Successfull : ', successMail);
                console.log('Failed : ', failedMail);
            });
        }

        readXlsxFile('/home/admin1/Documents/Practice/Login and Send Email/Login-Project-Angular/Backend on nodejs-express-mongodb/src/EDLN PL Oct 2022.xlsx').then((rows) => {
            rows.forEach(element => {
                console.log(element)
                if (process && element[0] != 'LOAN_NO' && mailCounter < 3) {
                    let mail = {
                        // TO: element[4],
                        // TO: 'shivi.aneja@incred.com,shivangi.tiwari@incred.com,amir.shaik@incred.com',
                        TO: reqBody.TO,
                        SUBJECT: reqBody.subject,
                        MESSAGE_BODY: emailContent(element),
                        SIGNATURE: '<br><b>Thanks<br>Incred</b> ',
                        "BCC": "care@incred.com"
                    };
                    sendEmail(mail);
                }
                mailCounter++;
            });
        });

        function writeFailRecord(text) {
            fs.appendFileSync('/home/admin1/Documents/Practice/Login and Send Email/Login-Project-Angular/Backend on nodejs-express-mongodb/src/record.txt', text);
        };

        function emailContent(data) {
            let content = `Sir/Madam,<br />
        
            This is a test email`;

            return content;

        }
    }
    catch (error) {
        console.log(error.message)
    }
}



module.exports = {
    createUser,
    login,
    getUser,
    getUserDetails,
    sendEmail,
    automatedMailSend
}