const express = require("express");
const router = express.Router();
const User = require("../models/user.js");
const wrapAsync = require("../utils/wrapAsync");
const passport = require("passport");
const {saveRedirectUrl} = require("../middleware.js");

const userController = require("../controllers/users.js");

//combine same router path 
//signup routes
//renderSignupForm
//add signup user detail to database
router.route("/signup")
.get(userController.renderSignupForm)
.post(wrapAsync(userController.signup));

//combine same router path 
//login Routes
//renderLoginForm
//passport authenticate user as a MiddleWare
//check user input detail for login account
router.route("/login")
.get(userController.renderLoginForm)
.post(saveRedirectUrl,passport.authenticate("local",{ failureRedirect: '/login',failureFlash: true }),userController.login);


//logged out Route
router.get("/logout",userController.logout);


module.exports = router;