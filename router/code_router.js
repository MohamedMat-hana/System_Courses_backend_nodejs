const express = require("express")

const router = express.Router();

const controller = require("../contollors/contollors_data")

const validationSchema = require("../MiddleWear/validationSchema");

const verfiyToken = require("../MiddleWear/verfiyToken");
const userRols = require("../stuats/userRols");
const allowTo = require("../MiddleWear/allowTo");
router.route("/")
    .get(controller.get_all)
    .post(
        verfiyToken,
        allowTo(userRols.MANGER),
        validationSchema(),
        controller.create)

router.route("/:id")
    .get(controller.get_single)
    .patch(controller.update)
    .delete(verfiyToken, allowTo(userRols.ADMIN, userRols.MANGER), controller.delete_one)


module.exports = router;