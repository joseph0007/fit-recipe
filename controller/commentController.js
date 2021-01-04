const Comment = require('../models/CommentModel');
//const AppError = require('../utils/AppError');
const catchAsync = require('../utils/catchAsync');
const CRUDfactory = require('../utils/CRUDfactory');

//add user and review id to req.body
exports.addIds = catchAsync(async (req, res, next) => {
  req.body.user = req.user._id;
  req.body.recipe = req.params.recipeId;
  next();
});

// GENERICS
exports.createComment = CRUDfactory.genericCreate(Comment);
exports.getOneComment = CRUDfactory.genericGetOne(Comment);
exports.getAllComment = CRUDfactory.genericGetAll(Comment);
exports.updateOneComment = CRUDfactory.genericUpdateOne(Comment);
exports.deleteOneComment = CRUDfactory.genericDeleteOne(Comment);
