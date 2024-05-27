let User = require("../models/user.js")

module.exports.changePassword =  async function (req,res){
    let {id} = req.params
    let {password, oldpassword} = req.body
    let user = await User.findById(id)
    if(user){
        user.changePassword(oldpassword, password, (err)=>{
            if(err){
                console.log(err)
                return res.redirect("/login")
            }
            user.appPassword = password
            console.log(user)

            res.redirect("/signin")
        })
    }
}

module.exports.deleteUser = async function (req,res){
    let {id} = req.params
    let user = await User.findById(id)
    console.log(await User.deleteOne({
        username: user.username
    }))
    res.redirect("/login")
}