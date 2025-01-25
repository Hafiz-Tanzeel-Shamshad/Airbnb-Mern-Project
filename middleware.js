const Listing = require("./models/listing");
const Review = require("./models/review.js");
const ExpressErorr = require("./utils/ExpressError.js");
const { listingSchema , reviewSchema} = require("./joiSchema.js");//require joi package


module.exports.loggedIn =   (req,res,next)=>{
    //console.log(req)//req is a object
    //console.log(req.path, "..." ,req.originalUrl);
    if(!req.isAuthenticated()){
        // save redirectUrl
        req.session.redirectUrl = req.originalUrl;//store into loals variable
        req.flash("error","You must be logged in to create listing!");
        return res.redirect("/login");
    }
    next();
}

//login, logout redirect link save in 
// cookie session locals variable
module.exports.saveRedirectUrl = (req,res,next)=>{
    if(req.session.redirectUrl){
        res.locals.redirectUrl = req.session.redirectUrl;
    }
    next();
}

// middleware
// check authentication: if user is owner of listing 
// then allow user for update,deletion & edit listing 
module.exports.isOwner = async(req,res,next)=>{
    let {id}  = req.params;
    let listing = await Listing.findById(id);
    if(!listing.owner.equals(res.locals.currUser._id)){
        req.flash("error" , "You are not owner of this listing");
        return res.redirect(`/listings/${id}`);
    }
    next();
}

//func for validate listings(data) using joi package
//Use joi as middleware and pass in routes
module.exports.validateListings = (req,res,next)=>{
    let {error} = listingSchema.validate(req.body);
    if(error){
        let errMsg = error.details.map((el)=>el.message).join(",");
        throw new ExpressErorr(404, errMsg);
    }else{
        next();
    }
}

//validation middleware of reviews
module.exports.validateReviews = (req,res,next)=>{
    let {error} = reviewSchema.validate(req.body);
    if(error){
        let errMsg = error.details.map((el)=>el.message).join(",");
        throw new ExpressErorr(404, errMsg);
    }else{
        next();
    }
}
      

// check authentication: if user is owner of review 
// then allow user to delete review 
module.exports.isReviewAuthor = async(req,res,next)=>{
    let {id , reviewId}  = req.params;
    let review = await Review.findById(reviewId);
    if(!review.author.equals(res.locals.currUser._id)){
        req.flash("error" , "You are not the author of this review");
        return res.redirect(`/listings/${id}`);
    }
    next();
}