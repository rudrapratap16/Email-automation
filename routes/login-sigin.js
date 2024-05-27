const express = require("express")
const router = express.Router()
const passport = require("passport")
const loginSigninController = require("../controllers/loginSigninController.js")

router.get("/home", loginSigninController.homePage)

router.get("/login", loginSigninController.loginGet)

router.post("/login", loginSigninController.loginPost)

router.get("/signin", loginSigninController.signinGet)

router.post("/signin",  passport.authenticate("local", {failureRedirect: "/signin"}), loginSigninController.signinPost)

router.get("/aboutUs", loginSigninController.aboutUs)

router.get("/logout", loginSigninController.logout)

module.exports = router