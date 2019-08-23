const express = require('express');
const router = express.Router();
const toursControllers = require('../controlles/toursControllers');
const authControllers = require('../controlles/authController');


router
  .route('/best')
  .get(toursControllers.bestTours, toursControllers.getAllTours);

router
  .route('/cheapest')
  .get(toursControllers.cheapestTours, toursControllers.getAllTours);


router
  .route('/average')
  .get(toursControllers.averageTours);


router
  .route('/')
  .get(authControllers.auth, toursControllers.getAllTours)
  .post(toursControllers.createTour);


router
  .route('/:id')
  .get(toursControllers.getTour)
  .put(toursControllers.updateTour)
  .delete(toursControllers.deleteTour);


module.exports = router;