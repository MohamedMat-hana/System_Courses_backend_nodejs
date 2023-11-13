const  mongoose  = require("mongoose")

const courseModel= new mongoose.Schema(
    {
        nameofcourse:{
            type:String,
            required:true
        },
        price:{
            type:Number,
            required:true
        }

    }
)

module.exports= mongoose.model("Course",courseModel);