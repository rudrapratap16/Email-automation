const express = require("express")
const app = express()
const User = require("../models/user.js")
const nodemailer = require("nodemailer");
const XLSX = require("xlsx")

require("dotenv").config();

module.exports.indexPage = function (req,res){
    let {id} = req.params
    res.render("index.ejs", {id})
}

module.exports.uploadFile = async function  (req, res)  {
    let {id} = req.params
    let user = await User.findById(id)
    let workbook = XLSX.read(req.file.buffer)
    const finalObject = {};
    let thing = []
    workbook.SheetNames.forEach(sheetName => {
        let rowObject = XLSX.utils.sheet_to_json(workbook.Sheets[sheetName]);
      
        finalObject[sheetName] = rowObject;
        thing.push(rowObject)
      });
    thing = thing.flat()
    let final = []
    let newobj = {}
    for(obj of thing){
        let keys = Object.keys(obj)
        let values = Object.values(obj)
        let num = 65
        for(i in keys){
            let temp = String.fromCharCode(num)
            Object.assign(newobj, {[temp] : obj[keys[i]]})
            num++
        }
        final.push(newobj)
        newobj = {}
    }
    app.locals.result = final
    res.redirect(`/upload/${id}/data`)
}

module.exports.showFile = async function (req,res){
    for(obj of app.locals.result){
            let newmessage = message
            let count= Object.keys(obj).length;
            for (i = 65; i <= 65 + count-1; i++) {
                newmessage = newmessage.replace('$'+String.fromCharCode(i), obj[String.fromCharCode(i)])
            }
    }
}

module.exports.showData = async function(req,res){
    let {id} = req.params
    res.render("data.ejs", {id})
}

module.exports.filterData = async function(req,res){
    let {subject, message} = req.body
    app.locals.subject = subject
    app.locals.message = message
    let {id} = req.params
    let user = await User.findById(id)
    let count = 0
    let list = []
    for(obj of app.locals.result){
            let newmessage = message
            let count= Object.keys(obj).length;
            for (i = 65; i <= 65 + count-1; i++) {
                newmessage = newmessage.replace('$'+String.fromCharCode(i), obj[String.fromCharCode(i)])
            }
            list.push(newmessage)
    }
    let result = app.locals.result
    res.render(`show.ejs`, {list, result, subject, id})
}

module.exports.endPage = async function(req,res){
    let {id} = req.params
    let errors = app.locals.errors
    res.render("endPage.ejs", {errors, id})
}

module.exports.sendMail = async function (req,res){
    let {id} = req.params
    let user = await User.findById(id)
    let count = 0
    app.locals.errors = []
    let list = []
    let counter = 1
    console.log(app.locals.result)
    for (obj of app.locals.result){
        
        // if(count != 0 ){
            let newmessage = app.locals.message
            let count= Object.keys(obj).length;
            for (i = 65; i <= 65 + count-1; i++) {
                newmessage = newmessage.replace('$'+String.fromCharCode(i), obj[String.fromCharCode(i)])
            }
            list.push(newmessage)
            let transporter = nodemailer.createTransport({
                service: 'gmail',
                auth: {
                    user: user.email,
                    pass: user.appPassword
                }
                });

            let mailOptions = {
                from: user.email,
                to: obj["A"],
                subject: app.locals.subject,
                text: newmessage
                };

            transporter.sendMail(mailOptions, function(error, info){
                if(counter == app.locals.result.length){
                    let transporter = nodemailer.createTransport({
                        service: 'gmail',
                        auth: {
                            user: user.email,
                            pass: user.appPassword
                        }
                        });
        
                    let mailOptions = {
                        from: user.email,
                        to: user.email,
                        subject: "You can now close the Window",
                        text: "You can now close the window as all the mails have been sent. You will be mailed all the mail address wich were invalid if any were present. Thank You."
                        };
                    transporter.sendMail(mailOptions, (err)=>{
                        console.log(err)
                    })
                }
            counter ++
            if (error) {
                console.log(error)
                app.locals.errors.push(error)
            } else {
                console.log('Email sent: ' + info.response);
            }
            });
        // }
        count = 1
    }

    res.redirect(`/upload/${id}/sent`)
}