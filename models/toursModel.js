const validator = require('validator');
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const TourSchema = new Schema({
  name: {
    type: String,
    required: [true, 'A tour must have a name'],
    maxlength: [40, 'A tour name must have less ore equal then 40 characters'],
    minlength: [10, 'A tour name must have more ore equal then 10 characters'],
    unique : true,
    trim: true
  },
  rating: {
    type: Number,
    default: 10
  },
  duration: {
    type: String,
    required: [true, 'A tour must have a duration']
  },
  maxGroupSize: {
    type: Number,
    default: 25
  },
  difficulty: {
    type: String,
    required: [true, 'A difficulty must have a name'],
    enum: {
      values: ['ease', 'medium', 'hard'],
      message: 'A tour difficulty must be ease, medium ore hard'
    }
  },
  ratingsAverage: {
    type: Number,
    default: 4.5,
    min: [0, 'A tour ratingsAverage must have more ore equal then 0'],
    max: [10, 'A tour ratingsAverage must have less ore equal then 10'],
  },
  ratingsQuantity: {
    type: Number,
    default: 0
  },
  price: {
    type: Number,
    required: [true, 'A tour must have a price']
  },
  priceDiscount: {
    type: Number,
    validate: {
      validator: function(val) {
        //work only create DOC
        return val < this.price
      },
      message: 'Discount price should be below regular price'
    }
  },
  summary: {
    type: String,
    required: [true, 'A tour must have a description'],
    trim: true
  },
  description: {
    type: String,
    trim: true
  },
  imageCover: {
    type: String
  },
  images: [String]
}, {
  versionKey: false,
  timestamps: true
});

module.exports = Tour = mongoose.model('Tour', TourSchema);