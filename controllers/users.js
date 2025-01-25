const User = require("../models/user.js");

module.exports.renderSignupForm = (req,res)=>{
    res.render("users/user.ejs");
}

module.exports.signup = async(req,res)=>{
    try{
        let {username,email,password} = req.body;
        const newUser = new User({username,email});
        const registerdUser = await User.register(newUser,password);//save to DB
        //console.log(registerdUser);
        req.login(registerdUser,(err)=>{
           if(err){
            next(err);
           }
           req.flash("sucess","Welcome to Wanderlust");
           res.redirect("/listings");
        });
       
    }catch(e){
        req.flash("error",e.message);
        res.redirect("/signup");
    }
}

module.exports.renderLoginForm = (req,res)=>{
    res.render("users/login.ejs");
}

module.exports.login = async(req,res)=>{
    req.flash("sucess","Welcome back to Wanderlust!")
    // res.redirect("/listings");
    res.locals.redirectUrl = res.locals.redirectUrl || "/listings"; 
    res.redirect(res.locals.redirectUrl);
}

module.exports.logout = (req,res,next)=>{
    req.logout((err)=>{
        if(err){
            next(err);
        }
        req.flash("sucess","You are logged out!");
        res.redirect("/listings");
    });
    
}