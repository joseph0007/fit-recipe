const Recipe = require('../models/RecipeModel');
const Comment = require('../models/CommentModel');
const AppError = require('./AppError');
const catchAsync = require('./catchAsync');

const checkIfAllowed = (user, author) => {
  //sexy trick: if we directly compare object_id it gives inconsistent outcome so always use string templates to encapsulate it
  return user.role === 'admin' || `${user._id}` === `${author._id}`;
};

exports.genericCreate = (model) =>
  catchAsync(async (req, res, next) => {
    if (req.file) req.body.imageCover = req.file.filename;

    if (model.modelName === 'Recipe') req.body.author = req.user._id;

    const doc = await model.create(req.body);

    res.status(201).json({
      status: 'success',
      data: {
        doc,
      },
    });
  });

exports.genericGetOne = (model) =>
  catchAsync(async (req, res, next) => {
    const doc = await model.findById(req.params.id);

    res.status(200).json({
      status: 'success',
      data: {
        doc,
      },
    });
  });

exports.genericGetAll = (model) =>
  catchAsync(async (req, res, next) => {
    const doc = await model.find();

    res.status(200).json({
      status: 'success',
      length: doc.length,
      data: {
        doc,
      },
    });
  });

exports.genericUpdateOne = (model) =>
  catchAsync(async (req, res, next) => {
    //FOR RECIPE
    if (model.modelName === 'Recipe') {
      const recipe = await Recipe.findById(req.params.id).select('+author');

      if (!checkIfAllowed(req.user, recipe.author))
        throw new AppError('Not authorized to perform this action', 401);
    }

    //FOR COMMENT
    if (model.modelName === 'Comment') {
      const comment = await Comment.findById(req.params.id);

      if (!checkIfAllowed(req.user, comment.user))
        throw new AppError('Not authorized to perform this action', 401);
    }

    //just add the editedAT to req.body
    req.body.editedAt = Date.now();

    const doc = await model.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    res.status(202).json({
      status: 'success',
      data: {
        doc,
      },
    });
  });

exports.genericDeleteOne = (model) =>
  catchAsync(async (req, res, next) => {
    //FOR RECIPE
    if (model.modelName === 'Recipe') {
      const recipe = await Recipe.findById(req.params.id).select('+author');

      if (!checkIfAllowed(req.user, recipe.author))
        throw new AppError('Not authorized to perform this action', 401);
    }

    //FOR COMMENT
    if (model.modelName === 'Comment') {
      const comment = await Comment.findById(req.params.id);

      if (!checkIfAllowed(req.user, comment.user))
        throw new AppError('Not authorized to perform this action', 401);
    }

    const doc = await model.findByIdAndDelete(req.params.id);

    res.status(204).json({
      status: 'success',
      data: {
        doc,
      },
    });
  });
