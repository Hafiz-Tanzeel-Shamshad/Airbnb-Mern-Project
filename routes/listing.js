const express = require("express");
const router = express.Router({mergeParams: true });

const wrapAsync = require("../utils/wrapAsync.js");

const Listing = require("../models/listing.js");
const {loggedIn , isOwner ,validateListings} = require("../middleware.js");


const listingController = require("../controllers/listings.js");

//npm multer package -- uploading image
const multer  = require('multer');
const {storage} = require("../cloudConfig.js");
const upload = multer({ storage });
// const upload = multer({ dest: 'uploads/' }); //save files into uploads folder

//index Route (show all titles)
//Create Route (submit form data to DB)
router.route("/")
.get(wrapAsync(listingController.index))
.post(loggedIn,upload.single('listing[image]'),validateListings,wrapAsync(listingController.createListing));
// .post(upload.single('listing[image]'),(req,res)=>{
//     res.send(req.body);
//     res.send(req.file);//display file details 
// });


//New Route (form display Route)
//is route ko lazmi /:id waly route sy uper rakhna ha
router.get("/new", loggedIn ,listingController.renderNewForm);


//Show (Read Route) 
//Update Route  -->id ki base pr update kro
//Use joi as middleware and pass in routes
//Delete Route
router.route("/:id")
.get(wrapAsync(listingController.showListings))
.put(loggedIn,isOwner,upload.single('listing[image]'),validateListings,wrapAsync(listingController.updateListing))
.delete(loggedIn,isOwner,wrapAsync(listingController.destroyListing)); 


//Edit Route -->id ki base pr find kro phir update kro
router.get("/:id/edit",loggedIn,isOwner,wrapAsync(listingController.renderEditForm));
 

module.exports = router;
 