const User = require("../models/user.js")

module.exports.homePage = function (req,res){
    res.render("index1")
}

module.exports.loginGet = (req,res)=>{
    res.render("login")
}

module.exports.loginPost = async (req,res)=>{
    try{
        let {email, password, username} = req.body
        let user = new User({
            username: username,
            email: email,
            appPassword: password
        })
    
        let reg = await User.register(user, password)
        res.redirect(`/signin`)
    } catch(e){
        res.redirect("/login")
    }
}

module.exports.signinGet = (req,res)=>{
    res.render("signin.ejs")
}

module.exports.signinPost = async(req,res)=>{
    let {username, password} = req.body
    let user = await User.findOne({username: username})
    res.redirect(`/upload/${user.id}`)
}

module.exports.aboutUs = async(req,res)=>{
    let {id} = req.params
    let user = await User.findById(id)
    res.render("aboutUs.ejs", {user})
}

module.exports.logout = (req,res)=>{
    req.logOut((err)=>{
        if(err){
            console.log(err)
        }
    })
    res.redirect("/signin")
}