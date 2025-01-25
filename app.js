if(process.env.NODE_ENV != "production"){
    require("dotenv").config();
}
// console.log(process.env.SECRET);

// ==========
const express = require("express");
const app = express();
const ejsMate = require("ejs-mate");//help for creating templates(layouts) 

const path = require("path");
const methodOverride = require("method-override");
 
const mongoose = require("mongoose");

//error class handler
const ExpressErorr = require("./utils/ExpressError.js");
//Express Router 
const listingRouter = require("./routes/listing.js");
const reviewRouter = require("./routes/review.js");
const userRouter = require("./routes/user.js");
//Express session coookie
const session = require("express-session");
const MongoStore = require('connect-mongo');
const flash = require("connect-flash");
//Passport npm
const passport = require("passport");
const LocalStrategy = require("passport-local");
const User = require("./models/user.js");



// let MONGO_URL = "mongodb://127.0.0.1:27017/wanderlust";
let MONGO_URL = process.env.ATLASDB_URI;
async function main(){
    await mongoose.connect(MONGO_URL);
}

main().then((res)=>{
    console.log("Connecting to Data Base");
}).catch((err)=>{
    console.log(err);
});

app.set("view engine","ejs");
app.set("views",path.join(__dirname,"views"));
app.use(express.urlencoded({extended : true}));//parse form data
app.use(methodOverride("_method"));
app.engine("ejs", ejsMate);
app.use(express.static(path.join(__dirname,"/public")));//for serve static files(css)

//store session in AtlasDB (online)
const store = MongoStore.create({
    mongoUrl: MONGO_URL,
    touchAfter: 24 * 3600,
    crypto: {
        secret: process.env.SECRET,
    },
})

store.on("error", function(e){
    console.log("Session Store Error", e);
});

const sessionOptions = {
    store,
    secret : process.env.SECRET,
    resave: false,
    saveUninitialized: true,
    cookie: {
        expires: Date.now() + 7 * 24 *60 *60 * 1000,
        maxAge: 7 * 24 *60 *60 * 1000, 
        httpOnly: true
    },
};

// app.get("/",(req,res)=>{
//     res.send("Hi, I am Root Route");
// });


app.use(session(sessionOptions));
app.use(flash());//use flash
//passport npm
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));//login/sign-up (user authentication)

// use static serialize and deserialize of model for passport session support
passport.serializeUser(User.serializeUser());//store user info in session cookie
passport.deserializeUser(User.deserializeUser());//remove user info in session cookie

//flash message middle ware
app.use((req,res,next)=>{
    res.locals.sucess = req.flash("sucess");
    res.locals.error = req.flash("error");
    //save user login detail in locals variable for access in ejs-template
    res.locals.currUser = req.user;
    next();  
});

// app.get("/demouser",async(req,res)=>{
//     let fakeUser = new User({
//         email: "student@gmail.com",
//         usrename : "Ali",
//     });

//     let registerdUser = await User.register(fakeUser, "password123");
//     res.send(registerdUser);
// })

app.use("/listings", listingRouter);//router
app.use("/listings/:id/reviews", reviewRouter);
app.use("/", userRouter);

//page not found error handler
app.all("*",(req,res,next)=>{
    next(new ExpressErorr(404 , "Page Not Found!"));
});
   
//Error Handler MiddleWare
app.use((err,req,res,next)=>{
    let {statusCode = 500, message = "Some Thing went wrong... "} = err;
    res.status(statusCode).render("Error.ejs",{err});
    // res.status(statusCode).send(message);
    // res.render("Error.ejs",{err});
    
});

const port = process.env.PORT;
app.listen(port, ()=>{
    console.log(`Connecting to server at port ${port}`);
});   