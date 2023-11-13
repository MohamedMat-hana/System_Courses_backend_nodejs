const jwt = require('jsonwebtoken');
const HttpStuats = require("../stuats/HttpStuats")
const appError = require("../stuats/AppError");
const verfiyToken = (req, res, next) => {
    const authToken = req.headers["Authorization"] || req.headers["authorization"]

    if (!authToken) {
        const error = appError.create('token is required', 401, HttpStuats.ERROR)
        return next(error);

    }
    const token = authToken.split(" ")[1];
    try {
         const currentUser = jwt.verify(token, process.env.JWT_SECRET_KAY)
        req.currentUser=currentUser;
         // console.log("decodedToken==>", decodedToken);
        
        next()
    } catch (err) {
        const error = appError.create('invailed token', 401, HttpStuats.ERROR)
        return next(error);

    }

    // console.log(token);
    // next();
}

module.exports = verfiyToken;
