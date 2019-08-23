const Tour = require('../models/toursModel');
const withCatch = require('../utils/catchAsync');
const AppError = require('../utils/appError');


exports.getAllTours = withCatch(async (req, res) => {
  // 1. Filtering query
  const filterQuery = { ...req.query };
  const excludedFields = ['page', 'sort', 'limit', 'fields'];
  excludedFields.forEach(field => delete filterQuery[field]);

  //2.  Advanced filtering
  let queryStr = JSON.stringify(filterQuery);
  queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, match => `$${match}`);


  let query = Tour.find(JSON.parse(queryStr));

  // 3. Sorting
  if (req.query.sort) {
    const sortBy = req.query.sort.split(',').join(' ');
    query = query.sort(sortBy);
  } else {
    query = query.sort('-createdAt');
  }

  // 4 Pagination
  const page = req.query.page * 1 || 1;
  const limit = req.query.limit * 1 || 10;
  const skip = (page - 1) * limit;
  query.skip(skip).limit(limit);


  const tours = await query;

  if (!tours.length) {
    return res.json({
      message: 'Page not exist...'
    });
  }

  res.json({
    results: tours.length,
    tours
  });
});


exports.bestTours = (req, res, next) => {
  req.query.limit = '10';
  req.query.sort = '-price';
  next();
};


exports.cheapestTours = (req, res, next) => {
  req.query.limit = '10';
  req.query.sort = 'price';
  next();
};

exports.averageTours = withCatch(async (req, res) => {
  const stats = await Tour.aggregate([
    // {
    //   $match: { ratingsAverage: { $gte: 4.5 } }
    // },
    {
      $group: {
        _id: null,
        tours: { $sum: 1 },
        allPrice: { $sum: '$price' },
        avgRating: { $avg: '$ratingsAverage' },
        avgPrice: { $avg: '$price' },
        minPrice: { $min: '$price' },
        maxPrice: { $max: '$price' }

      }
    }
  ]);

  res
    .status(200)
    .json(stats);

});


exports.createTour = withCatch(async (req, res) => {
  const newTour = await Tour.create(req.body);
  res
    .status(202)
    .json({
      status: 'success',
      tour: newTour
    });
});


exports.getTour = withCatch(async (req, res, next) => {
  const tour = await Tour.findById(req.params.id);

  if (!tour) {
    return next(new AppError(`No tour found with ID ${req.params.id}`), 404);
  }

  res
    .status(200)
    .json({
      status: 'success',
      tour
    });
});


exports.updateTour = withCatch(async (req, res, next) => {
  const tour = await Tour.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true
  });


  if (!tour) {
    return next(new AppError(`No tour found with ID ${req.params.id}`), 404);
  }

  res
    .status(200)
    .json({
      status: 'success',
      tour
    });
});


exports.deleteTour = withCatch(async (req, res, next) => {
  const tour = await Tour.findByIdAndDelete(req.params.id);

  if (!tour) {
    return next(new AppError(`No tour found with ID ${req.params.id}`), 404);
  }

  res
    .status(200)
    .json({ deleted: true });
});