var express = require('express');
var router = express.Router();

var ctrlLocations = require('../controllers/locations');
var ctrlOthers = require('../controllers/others');

/**
 * TODO: once all these controllers are deleted, this routes are no longer needed.
 */
/* GET home page. */
// router.get('/', ctrlLocations.homeList);
// router.get('/location', ctrlLocations.homeList);
// router.get('/location/:locationid', ctrlLocations.locationInfo);
// router.get('/location/review/new', ctrlLocations.addReview);
// router.get('/about', ctrlOthers.about);

// add reviews
// router.get('/location/:locationid/reviews/new', ctrlLocations.addReview);
// router.post('/location/:locationid/reviews/new', ctrlLocations.doAddReview);


router.get(/.*/, ctrlLocations.homeList);

module.exports = router;
