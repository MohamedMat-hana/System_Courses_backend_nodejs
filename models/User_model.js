const mongoose = require("mongoose");
const validator = require("validator");
const userRols = require("../stuats/userRols");


const UserModel = new mongoose.Schema(
    {
        firstName: {
            type: String,
            required: true
        },
        lastName: {
            type: String,
            required: true
        },
        email: {
            type: String,
            required: true,
            unique: true,
            validate: [validator.isEmail, 'Please enter a valid email']
        },
        password: {
            type: String,
            required: true
        },
        token: {
            type: String,

        },
        role: {
            type: String,
            enum: [userRols.ADMIN,userRols.MANGER,userRols.USER],
            default: userRols.USER
        },
        avatar:{
            type:String,
            default:"Uploads/Profile.JPG"
        }
    }
    
)

module.exports = mongoose.model("User", UserModel);