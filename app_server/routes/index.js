var express = require('express');
var router = express.Router();
var ctrlLocations = require('../controllers/locations');

router.get('/', ctrlLocations.homelist);
router.get('/location', ctrlLocations.locationInfo);
router.get('/location/review/new', ctrlLocations.addReview);
router.get('/about', ctrlLocations.about);


module.exports = router;