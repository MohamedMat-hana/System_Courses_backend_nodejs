const asyncWrapper = require("../MiddleWear/asyncWrapper");
const user = require("../models/User_model");
const HttpStuats = require("../stuats/HttpStuats")
const appError = require("../stuats/AppError");
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const genarateJWT = require("../stuats/genarateJWT");


const get_all_User = asyncWrapper(async (req, res) => {
    // console.log(req.headers)
    const query = req.query;

    const limit = query.limit || 10;
    const page = query.page || 1;
    const skip = (page - 1) * limit;
    // get data fron DB
    let users = await user.find({}, { "__v": false, "password": false }).limit(limit).skip(skip);
    res.json({ status: HttpStuats.SUCCESS, data: { users } })
})

const reqister = asyncWrapper(async (req, res, next) => {
    console.log(req.file);


    const { firstName,
        lastName,
        email,
        password,
        role
    } = req.body;


    const oldUser = await user.findOne({ email: email })
    if (oldUser) {
        const error = appError.create('Email is already exist', 400, HttpStuats.FAIL)
        return next(error);
    }
    const hashedPassowrd = await bcrypt.hash(password, 10)

    const newuser = new user({
        firstName,
        lastName,
        email,
        password: hashedPassowrd,
        role,
        avatar:req.file.filename
    });

    // create JWT Token

    const token =await genarateJWT({ _id: newuser._id, email: newuser.email ,role :newuser.role})  
    
    newuser.token = token;
    
    
    await newuser.save();
    res.status(201).json({ status: HttpStuats.SUCCESS, data: { newuser } })

})
const login = asyncWrapper(async (req, res, next) => {
    const { email, password } = req.body;
    if (!email && !password) {
        const error = appError.create('Please provide email and password', 400, HttpStuats.FAIL)
        return next(error);

    }
    const User = await user.findOne({ email: email })
    if (!User) {
        const error = appError.create('user is not exist', 400, HttpStuats.FAIL)
        return next(error);
    }

    const mathchedpassword = await bcrypt.compare(password, User.password)
    console.log(mathchedpassword);
    // "logged in success" 
    if (User && mathchedpassword) {
        const token =await genarateJWT({ _id: User._id, email: User.email,role:User.role })  

        return res.json({ status: HttpStuats.SUCCESS, data: {token } })
    }
    else {
        const error = appError.create('Something is wrong', 500, HttpStuats.ERROR)
        return next(error);
    }

})

module.exports = {
    get_all_User,
    reqister,
    login
}