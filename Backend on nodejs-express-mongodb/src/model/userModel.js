const mongoose = require("mongoose");
const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        trim: true,
        // unique:true
    },
    age:{
        type: Number,
        required: true,
    },
    email: {
        type: String,
        required: true,
        // unique: true,
        trim: true
    },
    phone: {
        type: Number,
        required: true,
        // unique: true,
        trim: true
    },
    password: {
        type: String,
        required: true,
        trim: true
    },
    createdAt: {
        type: String
    },
    updatedAt: {
        type: String
    }
}, { versionKey: false })

module.exports = mongoose.model("loginApp", userSchema)