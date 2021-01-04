const Ingredient = require('../models/IngredientModel');
const catchAsync = require('../utils/catchAsync');
const CRUDfactory = require('../utils/CRUDfactory');

//USE THIS MODEL IF USER INPUTS HIS/HER OWN NURIENT INFO
//this can be marked as user inputed value!!! ;)
exports.createIngredientDoc = catchAsync(async (req, res, next) => {
  console.log(req.body);
  const { ingredientsList } = req.body;
  const listArr = [];

  //check if the data is userInput or not
  ingredientsList.forEach((el) => {
    if (el.userInputed || el.userInputed === true)
      listArr.push(el.nutrientProfile);
  });

  //save it to the document
  await Ingredient.create(listArr);

  next();
});

//GENERIC CRUD
exports.createIngredient = CRUDfactory.genericCreate(Ingredient);
exports.getOneIngredient = CRUDfactory.genericGetOne(Ingredient);
exports.getAllIngredient = CRUDfactory.genericGetAll(Ingredient);
exports.updateOneIngredient = CRUDfactory.genericUpdateOne(Ingredient);
exports.deleteOneIngredient = CRUDfactory.genericDeleteOne(Ingredient);
