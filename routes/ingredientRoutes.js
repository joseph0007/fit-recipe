const express = require('express');
const authController = require('../controller/authController');
const ingredientController = require('../controller/ingredientController');
const uniformUnits = require('../utils/uniformUnits');

const router = express.Router();

//testing uniformUnits
router.post('/uniform', uniformUnits);

router.use(authController.protect, authController.allowOnly('admin'));

router.route('/').post(ingredientController.createIngredient);
router.route('/').get(ingredientController.getAllIngredient);

router.route('/:id').get(ingredientController.getOneIngredient);
router.route('/:id').patch(ingredientController.updateOneIngredient);
router.route('/:id').delete(ingredientController.deleteOneIngredient);

module.exports = router;
