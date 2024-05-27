const express = require("express")
const router = express.Router()
const multer  = require('multer')
const storage = multer.memoryStorage()
const upload = multer({ storage: storage })
const {isLoggedin} = require("../middlewares/login.js")
const controller = require("../controllers/uploadController.js")

router.get("/:id", isLoggedin, controller.indexPage)

router.post('/:id', upload.single('uploaded_file'), isLoggedin, controller.uploadFile)

router.get("/:id/show",isLoggedin, controller.showFile)

router.get("/:id/data",isLoggedin, controller.showData)

router.post("/:id/data",isLoggedin, controller.filterData)

router.post("/:id/mail",isLoggedin, controller.sendMail)

router.get("/:id/sent", isLoggedin, controller.endPage)

module.exports = router
