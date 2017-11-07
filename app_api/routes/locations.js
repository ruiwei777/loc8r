var express = require('express');
var router = express.Router();
var ctrlLocations = require('../controllers/locations');
var ctrlReviews = require('../controllers/reviews');

// locations
router.get('/locations', ctrlLocations.locationsListByDistance);
router.post('/locations', ctrlLocations.locationsCreate);

// details
router.get('/locations/:locationId', ctrlLocations.locationsReadOne);
router.put('/locations/:locationId', ctrlLocations.locationsUpdateOne);
router.delete('/locations/:locationId', ctrlLocations.locationsDeleteOne);

// reviews
router.post('/locations/:locationid/reviews', ctrlReviews.reviewsCreate);
router.get('/locations/:locationid/reviews/:reviewid',ctrlReviews.reviewsReadOne);
router.put('/locations/:locationid/reviews/:reviewid',ctrlReviews.reviewsUpdateOne);
router.delete('/locations/:locationid/reviews/:reviewid',ctrlReviews.reviewsDeleteOne);




module.exports = router;