const mongoose = require('mongoose');
// const AppError = require('../utils/AppError');
// const catchAsync = require('../utils/catchAsync');
// const Recipe = require('./RecipeModel');

const commentSchema = mongoose.Schema({
  comment: {
    type: String,
    required: [true, 'Comment cannot be empty!'],
    maxlength: [30, 'comment should not exceed 500 characters'],
    minlength: [3, 'comment should atleast contain 5 characters'],
  },
  user: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: [true, 'user Id must be provided :('],
  },
  recipe: {
    type: mongoose.Schema.ObjectId,
    ref: 'Recipe',
    required: [true, 'Recipe Id must be provided :('],
  },
  previousRating: {
    type: Number,
  },
  rating: {
    type: Number,
    max: [5, 'Please provide a rating between 0 and 5 :)'],
    min: [0, 'Please provide a rating between 0 and 5 :)'],
  },
  createdAt: {
    type: Date,
    default: Date.now(),
  },
  editedAt: Date,
});

//to create a composite unique key
commentSchema.index({ user: 1, recipe: 1 }, { unique: true });

//to populate
commentSchema.pre(/^find/, function (next) {
  this.populate({
    path: 'user',
    select: 'name photo _id',
    //do not populate recipe it will just put this inside a loop of populate
    //if you want to populate recipe then switch off populate for 'comments' field in recipe model middleware
    // }).populate({
    //   path: 'recipe',
    //   select: 'name -_id -comments',
  });
  next();
});

const Comment = mongoose.model('Comment', commentSchema);

module.exports = Comment;
