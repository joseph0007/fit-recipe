const mongoose = require('mongoose');

const ingredientSchema = mongoose.Schema({
  description: {
    type: String,
    required: [true, 'Ingredient must have a name!'],
    maxlength: [30, 'Ingredient name should not exceed 20 characters'],
    minlength: [3, 'Ingredient name should atleast contain 3 characters'],
  },
  brandOwner: String,
  foodNutrients: [
    {
      nutrientName: {
        type: String,
        required: [true, 'You must provide a nutrient name!'],
      },
      unitName: {
        type: String,
        required: [true, 'You must provide a Unit!'],
      },
      value: {
        type: Number,
        required: [true, 'You must provide a nutrient value!'],
      },
    },
  ],
  quantity: {
    type: Number,
    default: 100,
  },
  unit: {
    type: String,
    default: 'g',
  },
  userInputed: {
    type: Boolean,
    default: true,
  },
  createdAt: {
    type: Date,
    default: Date.now(),
  },
});

const Ingredient = mongoose.model('Ingredient', ingredientSchema);

module.exports = Ingredient;
