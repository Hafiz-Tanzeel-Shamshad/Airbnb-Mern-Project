const express = require("express");
const router = express.Router({ mergeParams: true });     

const wrapAsync = require("../utils/wrapAsync.js");
const Listing = require("../models/listing.js");//listing schema
const Review = require("../models/review.js");//review schema
const {validateReviews , loggedIn , isReviewAuthor} = require("../middleware.js");

const reviewController = require("../controllers/reviews.js");


//Post Reviews Route
router.post("/",validateReviews,loggedIn,wrapAsync(reviewController.createReview));;

//Delete Review Route
router.delete("/:reviewId",loggedIn,isReviewAuthor,wrapAsync(reviewController.destroyReview));

module.exports = router;