const express = require("express");

const router = express.Router();
const multer = require('multer')
const AppError = require("../stuats/AppError");

const diskStorage1 = multer.diskStorage({
    destination: function (req, file, cb) {
        console.log("FILE", file);
        cb(null, "uploads")
    },
    filename: function (req, file, cb) {
        const ext = file.mimetype.split("/")[1];
        const filename = Date.now() + '.' + ext
        cb(null, filename)
    }

})
const fileFilter = function (req, file, cb)  {

    const Image = file.mimetype.split("/")[0];
    if (Image == "image") {
        cb(null, file)
    }
    else {
        cb(AppError.create("file must be an image", 400), false)
    }
}
const upload = multer({
     storage: diskStorage1,
     fileFilter:fileFilter})

const contollors_Users = require("../contollors/contollors_Users")

const verfiyToken = require("../MiddleWear/verfiyToken");
router.route("/")
    .get(verfiyToken, contollors_Users.get_all_User)


router.route("/reqister")
    .post(upload.single('avatar'), contollors_Users.reqister)

router.route("/login")
    .post(contollors_Users.login)



module.exports = router;