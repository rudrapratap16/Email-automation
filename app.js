if(process.env.NODE_ENV!="production"){
    require("dotenv").config()
}

const express = require("express")
const app = express()
const methodOverride = require("method-override")
const mongoose = require("mongoose")
const path = require("path")
const ejsMate = require("ejs-mate")
const MONGO_URL = process.env.DB_URL
const session = require("express-session")
const MongoStore = require('connect-mongo');
const passport = require("passport")
const localStrategy = require("passport-local")
const User = require("./models/user.js")
const port = 8080
const loginSigninController = require("./controllers/loginSigninController.js")

const store = MongoStore.create({
    mongoUrl: MONGO_URL,
    crypto:{
        secret: process.env.SESSION_SECRET
    },
    touchAfter: 24*3600
})

const sessionOptions = {
    store: store,
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: true,
}


store.on("error", ()=>{
    console.log("error in mongo store")
})

app.use(session(sessionOptions))
app.use(passport.initialize())
app.use(passport.session())
passport.use(new localStrategy(User.authenticate()))
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());


let loginSigninRouter = require("./routes/login-sigin.js")
let uploadRouter = require("./routes/upload.js")
let updateDeleteRouter = require("./routes/update-delete.js")

app.use(express.urlencoded({extended: true}))
app.use(methodOverride("_method"))
app.use(express.static(path.join(__dirname, "/public")))

app.set("view engine", "ejs")
app.set("views", path.join(__dirname, "views"))

app.engine("ejs", ejsMate);

main().then((res)=>{
    console.log("Connected to db")
}).catch((err)=>{
    console.log(err)
})

async function main(){
    await mongoose.connect(MONGO_URL)
}

app.get("/", loginSigninController.homePage)

app.use("/", loginSigninRouter)
app.use("/upload", uploadRouter)
app.use("/upload/modify", updateDeleteRouter)

app.listen(port, ()=>{
    console.log("listening on port 8080")
})