const express = require('express');
const authController = require('../controller/authController');
const recipeController = require('../controller/recipeController');
const ingredientController = require('../controller/ingredientController');
const convertUnits = require('../utils/uniformUnits');
const commentRouter = require('./commentRoutes');
const { uploadImage, processImage } = require('../utils/imageProcessing');

const router = express.Router();

router.route('/').get(recipeController.getAllRecipe);
router.route('/:id').get(recipeController.getOneRecipe);

//test(SEARCH ENGINE)
router.get(
  '/search/:searchQuery',
  recipeController.searchEngine,
  recipeController.getSearchDocs
);

//top 100 recipes
router.get('/top100', recipeController.getTop100);

//filtering
router.get('/cuisines/:cuisinesArr', recipeController.getRecipesAccToCuisine);
router.get('/category/:categoryName', recipeController.getRecipesAccToCategory);
router.get('/tags/:tagsArr', recipeController.getRecipesAccToTags);

router.use(authController.protect);

//posting a comment
router.use('/:recipeId/comments', commentRouter);

//test
router.post(
  '/get-nutri-info',
  ingredientController.createIngredientDoc,
  recipeController.getNutriProfile,
  convertUnits,
  recipeController.calcRecipeNutriProfile
);

//like
router.patch('/likes/:recipeId', recipeController.likesManager);

router.use(authController.allowOnly('admin', 'user'));

router
  .route('/')
  .post(uploadImage, processImage, recipeController.createRecipe);
router.route('/:id').patch(recipeController.updateOneRecipe);
router.route('/:id').delete(recipeController.deleteOneRecipe);

module.exports = router;
