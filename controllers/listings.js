const Listing = require("../models/listing");
const mbxGeocoding = require('@mapbox/mapbox-sdk/services/geocoding');
const mapToken = process.env.MAP_TOKEN;
const geocodingClient = mbxGeocoding({accessToken: mapToken});


module.exports.index = async(req,res)=>{
    const allListings =  await Listing.find({});
    res.render("./listings/index.ejs",{allListings});
 
}

module.exports.renderNewForm = (req,res)=>{
    //console.log(req.user);
    // if(!req.isAuthenticated()){
    //     req.flash("error","You must be logged in to create listing!");
    //     return res.redirect("/login");
    // }
    res.render("listings/new.ejs");
 }

module.exports.showListings = async(req,res)=>{ 
    let {id} = req.params;
    const listing = await Listing.findById(id).populate({path: "reviews",populate: {path:"author"}}).populate("owner");
    if(!listing){
       req.flash("error" , "Listing you requested for does not exist!");
       res.redirect("/listings")
    }
    //show all listings details
    console.log(listing.owner.username);
    res.render("./listings/show.ejs",{listing});
} 

module.exports.createListing = async(req,res,next)=>{

    let response= await geocodingClient.forwardGeocode({
        query: req.body.listing.location,
        limit: 1,
    })
    .send();
    // console.log(response.body.features[0].geometry.coordinates);
   

    // let {title , description , image , price , country , location} = req.body;
    //let listing = req.body.listing;

    //use 'joi' for validate server side error
    // let result = listingSchema.validate(req.body);
    // console.log(result);
    // if(result.error){
    //     throw new ExpressErorr(404, result.error);
    // }

    // if(!req.body.Listings){
    //     throw new ExpressErorr(400,"Send valid data for listing");
    // }

    let url = req.file.path;//get image from cloudinary
    let filename = req.file.filename;
    // console.log(url ,"..." , filename);
    const newListing = new Listing(req.body.listing); //insert data to DB
    // if(!newListing.title){
    //     throw new ExpressErorr(400,"Title is Missing");
    // }
    newListing.owner = req.user._id;//passport by-default store user info (show in ejs page)
    newListing.image = { url , filename };

    newListing.geometry = response.body.features[0].geometry;

    let savedListing = await newListing.save(); //save data to DB
    console.log(savedListing);

    req.flash("sucess" , "New Listing Created!");
    res.redirect("/listings");
}

module.exports.renderEditForm = async(req,res)=>{
    let {id} = req.params;
    const listing = await Listing.findById(id);
    if(!listing){
       req.flash("error" , "Listing you requested for does not exist!");
       res.redirect("/listings")
    }
    // console.log(listing.image.url);
    let originalImageUrl = listing.image.url;
    originalImageUrl = originalImageUrl.replace("/upload", "/upload/w_250/bo_10px_solid_lightblue");
    res.render("listings/edit.ejs",{listing , originalImageUrl });
}

module.exports.updateListing = async(req,res)=>{
    
    // if(req.body.Listings){
    //     throw new ExpressErorr(400,"Send valid data for listing");
    // }
    let {id} = req.params;
   //  let listing = await Listing.findById(id);
   //  if(!listing.owner._id.equals(currUser._id)){
   //     req.flash("error" , "You don't have permission to edit");
   //     return res.redirect(`/listings/${id}`);
   //  }
   let listing =  await Listing.findByIdAndUpdate(id,{...req.body.listing});//destructing

    if(typeof req.file !== "undefined"){
        let url = req.file.path;
        let filename = req.file.filename;
        listing.image = {url , filename};

        await listing.save();
    }

    req.flash("sucess" , "Listing Updated!");
    res.redirect(`/listings/${id}`);
}

module.exports.destroyListing = async(req,res)=>{
    let {id} = req.params;
    await Listing.findByIdAndDelete(id);
    req.flash("sucess" , "Listing Deleted!");
    res.redirect("/listings");
}