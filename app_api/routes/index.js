const express = require('express');
const router = express.Router();
const ctrlLocations = require('../controllers/locations');

router
  .route('/locations')
  .get(ctrlLocations.locationsListByDistance)
  .post(ctrlLocations.locationsCreate);

router
  .route('/locations/:locationid')
  .get(ctrlLocations.locationsReadOne)
  .put(ctrlLocations.locationsUpdateOne)
  .delete(ctrlLocations.locationsDeleteOne);

router
  .route('/locations/:locationid/reviews')
  .post(ctrlLocations.reviewsCreate);

router
  .route('/locations/:locationid/reviews/:reviewid')
  .get(ctrlLocations.reviewsReadOne)
  .delete(ctrlLocations.reviewsDeleteOne);

module.exports = router;