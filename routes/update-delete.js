const express = require("express")
const controller = require("../controllers/updateDeleteController.js")
const router = express.Router()
let User = require("../models/user.js")

router.get("/:id/patch", async(req,res)=>{
    let {id} = req.params
    let user = await User.findById(id)
    res.render("update.ejs", {user})
})

router.patch("/:id/patch", controller.changePassword)

router.get("/:id/delete", controller.deleteUser)

module.exports = router