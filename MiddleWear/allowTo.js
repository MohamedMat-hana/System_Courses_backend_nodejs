const AppError = require("../stuats/AppError");

module.exports=(...roles)=>{
    console.log(roles);
    return(req,res,next)=>{
        console.log(req.currentUser.role);
        if(!roles.includes(req.currentUser.role)){
            const error = AppError.create('you are not authorized to access this route',401 )
            return next(error);
        }
        
next();
    }
}