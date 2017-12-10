var express = require('express');
var router = express.Router();
var ctrlLocations = require('./controllers/locations');
var ctrlReviews = require('./controllers/reviews');

// Locations
router.get('/locations', ctrlLocations.locationsList);

router.post('/locations', ctrlLocations.locationsCreate);
router.get('/locations/:locationId', ctrlLocations.locationsReadOne);
router.put('/locations/:locationId', ctrlLocations.locationsUpdateOne);
router.delete('/locations/:locationId', ctrlLocations.locationsDeleteOne);

// Reviews
router.post('/locations/:locationId/reviews', ctrlReviews.reviewsCreate);
router.get('/locations/:locationId/reviews/:reviewId',ctrlReviews.reviewsReadOne);
router.put('/locations/:locationId/reviews/:reviewId',ctrlReviews.reviewsUpdateOne);
router.delete('/locations/:locationId/reviews/:reviewId',ctrlReviews.reviewsDeleteOne);


module.exports = router;
