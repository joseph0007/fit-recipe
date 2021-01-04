const mongoose = require('mongoose');
const { default: validator } = require('validator');
const { tagList, cuisineList } = require('../utils/list');

const recipeSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Recipe must have a name!'],
      maxlength: [30, 'Recipe name should not exceed 20 characters'],
      minlength: [3, 'Recipe name should atleast contain 3 characters'],
      validate: {
        validator: validator.isAlpha,
        message: 'Please enter only alphanumeric characters',
      },
    },
    ingredients: [
      {
        name: {
          type: String,
          required: [true, 'Recipe must have atleast one ingredient!'],
        },
        quantity: {
          type: Number,
          required: [true, 'You must provide the quantity!'],
        },
        unit: {
          type: String,
          enum: {
            values: ['g', 'kg', 'oz', 'lb', 'ml', 'l', 'tsp', 'Tbs', 'cup'],
            message: `Only g, kg, oz, lb, ml, l, tsp, Tbs, cup values are accepted`,
          },
          required: [true, 'You must provide the units!'],
        },
      },
    ],
    cookingTime: {
      // inconsistency pls check!!
      type: Number,
      required: [true, 'You must provide the cooking time!'],
    },
    servings: {
      type: Number,
      required: [true, 'You must provide the servings!'],
    },
    nutrientProfile: Object,
    healthBenefits: [
      {
        type: String,
        maxlength: [
          300,
          'Please describe the recipe in 300 or less characters',
        ],
      },
    ],
    instructions: [
      {
        type: String,
        maxlength: [
          300,
          'Please describe the recipe in 300 or less characters',
        ],
      },
    ],
    description: {
      type: String,
      maxlength: [500, 'Please describe the recipe in 500 or less characters'],
    },
    imageCover: String,
    images: [String],
    author: {
      type: mongoose.Schema.ObjectId,
      ref: 'User',
      required: [true, 'author Id must be provided :('],
    },
    createdAt: {
      type: Date,
      default: Date.now(),
    },
    editedAt: Date,
    keywords: [String],
    //categorization
    category: {
      type: String,
      default: 'not specified',
      enum: {
        values: ['sweet', 'savoury', 'not specified', 'others'],
        message: 'Not a valid category :(',
      },
    },
    //categorization
    tags: {
      type: Array,
      validate: {
        validator: function () {
          const result = [];
          this.tags.forEach((el1) => {
            tagList.forEach((el2) => {
              if (el2 === el1) result.push(true);
            });
          });

          if (result.length !== this.tags.length) return false;

          return true;
        },
        message: 'Not a valid tag :(',
      },
    },
    //categorization
    cuisine: {
      type: String,
      default: 'others',
      validate: {
        validator: function () {
          const result = cuisineList.find(
            (el) => el.toLowerCase() === this.cuisine.toLowerCase()
          );
          if (!result) return false;
          return true;
        },
        message: 'Not a valid cuisine :(',
      },
    },
    //measuring popularity
    hits: {
      type: Number,
      default: 0,
    },
    likes: {
      type: Number,
      default: 0,
    },
    linkToOriginal: String,
  },
  {
    toJSON: {
      virtuals: true,
    },
    toObject: {
      virtuals: true,
    },
  }
);

recipeSchema.virtual('comments', {
  ref: 'Comment',
  foreignField: 'recipe',
  localField: '_id',
});

recipeSchema.virtual('averageRating').get(function () {
  let sum = 0;
  this.comments.forEach((el) => {
    sum += el.rating;
  });

  return Math.round((sum / this.comments.length) * 10) / 10;
});

recipeSchema.pre(/^find/, function (next) {
  this.populate({
    path: 'author',
    select: 'name photo -_id',
  }).populate({
    path: 'comments',
    select: 'comment rating user -recipe -_id',
  });
  next();
});

//increase the popularity if MODEL = RECIPE
recipeSchema.post('findOne', async function (doc, next) {
  if (!doc || doc.hits === undefined) return next();

  doc.hits += 1;
  await doc.save();
  next();
});

const Recipe = mongoose.model('Recipe', recipeSchema);

module.exports = Recipe;
