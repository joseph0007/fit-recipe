const convert = require('convert-units');
const MiniSearch = require('minisearch');
const Recipe = require('../models/RecipeModel');
const User = require('../models/UserModel');
const AppError = require('../utils/AppError');
const catchAsync = require('../utils/catchAsync');
// const catchAsync = require('../utils/catchAsync');
const CRUDfactory = require('../utils/CRUDfactory');
const { tagList, cuisineList, categoryList } = require('../utils/list');

//function to check if a value is present in an array
const checkIfPresent = (list, checkItem) => {
  let checkArr = [];
  const result = [];

  if (!Array.isArray(checkItem)) {
    checkArr.push(checkItem);
  } else checkArr = checkItem;

  console.log(checkArr);

  checkArr.forEach((el1) => {
    list.forEach((el2) => {
      if (el1.toLowerCase() === el2.toLowerCase()) result.push(true);
    });
  });

  if (result.length === checkArr.length) return true;

  return false;
};

//to calculate micro/macro
const calcMicroMacro = (list) => {
  const macros = [];
  const micros = [];
  let energy;

  const macroNutrientArr = [
    /carbohydrate/,
    /total lipid/,
    /fiber/,
    /fatty acids, total monounsaturated/,
    /fatty acids, total polyunsaturated/,
    /fatty acids, total saturated/,
    /protein/,
    /sugar/,
    /water/,
  ];

  const microNutrientArr = [
    /Vitamin/,
    /choline/,
    /alcohol/,
    /folate/,
    /retinol/,
    /folate/,
    /niacin/,
    /carotene/,
    /cryptoxanthin/,
    /lycopene/,
    /folic acid/,
    /caffeine/,
    /theobromine/,
    /lutein/,
    /sodium/,
    /calcium/,
    /niacin/,
    /isoleucine/,
    /leucine/,
    /lysine/,
    /cystine/,
    /valine/,
    /arginine/,
    /histidine/,
    /aspartic acid/,
    /serine/,
    /iron/,
    /tryptophan/,
    /threonine/,
    /thiamin/,
    /riboflavin/,
    /methionine/,
    /phenylalanine/,
    /tyrosine/,
    /alanine/,
    /glutamic acid/,
    /glycine/,
    /proline/,
    /cholesterol/,
    /potassium/,
    /zinc/,
    /magnesium/,
    /phosphorus/,
    /copper/,
    /manganese/,
    /selenium/,
  ];

  list.forEach((el1) => {
    const boolMacro = macroNutrientArr.map((el) =>
      el.test(el1.nutrientName.toLowerCase())
    );
    const boolMicro = microNutrientArr.map((el) =>
      el.test(el1.nutrientName.toLowerCase())
    );

    if (boolMacro.includes(true)) {
      macros.push(el1);
    }

    if (boolMicro.includes(true)) {
      micros.push(el1);
    }

    if (el1.nutrientName.toLowerCase() === 'energy') {
      energy = el1;
    }
  });

  return {
    macros,
    micros,
    energy,
  };
};

const calcAccToQuantity = (ingredient, multiplier) => {
  //MACRO
  if (ingredient.nutrientProfile.foodNutrients.macros)
    ingredient.nutrientProfile.foodNutrients.macros.forEach((el) => {
      el.value *= multiplier;
    });

  //MICRO
  if (ingredient.nutrientProfile.foodNutrients.micros)
    ingredient.nutrientProfile.foodNutrients.micros.forEach((el) => {
      el.value *= multiplier;
    });

  //ENERGY
  if (ingredient.nutrientProfile.foodNutrients.energy)
    ingredient.nutrientProfile.foodNutrients.energy.value *= multiplier;
};

//CALCULATE NUTRITIONAL PROFILE OF RECIPE
exports.calcRecipeNutriProfile = (req, res, next) => {
  const { ingredientsList } = req.body;

  //STEP:1 calculate according to quantity
  ingredientsList.forEach((ingredient) => {
    //calculate the number to multiply
    const mul = ingredient.quantity / 100;

    //CALCULATE MICRO/MACRO ACC TO QUANTITY
    calcAccToQuantity(ingredient, mul);
  });

  let totEnergy;
  let totMacros;
  let totMicros;
  const note = [];

  //   ingredientsList.forEach((el) => {
  //     console.log(el.nutrientProfile.foodNutrients);
  //   });

  //STEP:2 ADDING THE QUANTITIES
  ingredientsList.forEach((el) => {
    //check if the nutrientProfile is actually provided
    if (
      !el.nutrientProfile.foodNutrients.energy ||
      !el.nutrientProfile.foodNutrients.macros ||
      !el.nutrientProfile.foodNutrients.micros
    ) {
      note.push(
        `Nutritional value of ${el.name} is not provided and hence not added into the totol recipe nutritional information`
      );
    } else if (!totEnergy && !totMacros && !totMicros) {
      totEnergy = el.nutrientProfile.foodNutrients.energy;
      totMacros = el.nutrientProfile.foodNutrients.macros;
      totMicros = el.nutrientProfile.foodNutrients.micros;
    } else {
      //ADD THE TOTAL ENERGY
      totEnergy.value += el.nutrientProfile.foodNutrients.energy.value;

      //ADD THE TOTAL MACROS
      const newMacro = [];
      el.nutrientProfile.foodNutrients.macros.forEach((el1) => {
        const nutriObj = totMacros.find(
          (nutrient) => nutrient.nutrientName === el1.nutrientName
        );

        if (nutriObj) nutriObj.value += el1.value;
        else newMacro.push(el1);
      });
      totMacros = totMacros.concat(newMacro);

      //ADD THE TOTAL MICROS
      const newMicro = [];
      el.nutrientProfile.foodNutrients.micros.forEach((el1) => {
        const nutriObj = totMicros.find(
          (nutrient) => nutrient.nutrientName === el1.nutrientName
        );

        if (nutriObj) {
          //1.check if the unitName is the same
          const checkUnit = [
            'mcg',
            'mg',
            'g',
            'kg',
            'oz',
            'lb',
            'ml',
            'l',
            'tsp',
            'Tbs',
            'cup',
            'ug',
          ];
          if (!nutriObj.unitName === el1.unitName) {
            if (
              checkUnit.find((unit) => unit === nutriObj.unitName.toLowerCase())
            ) {
              el1.value = convert(el1.value)
                .from(
                  el1.unitName === 'UG' ? 'mcg' : el1.unitName.toLowerCase()
                )
                .to(
                  nutriObj.unitName === 'UG'
                    ? 'mcg'
                    : nutriObj.unitName.toLowerCase()
                );
            }
          }

          //add the values
          nutriObj.value += el1.value;
        } else newMicro.push(el1);
      });
      totMicros = totMicros.concat(newMicro);

      //   //ADD THE TOTAL MICROS
      //   const newMicro = [];
      //   el.nutrientProfile.foodNutrients.micros.forEach((el1) => {
      //     totMicros.forEach((el2) => {
      //       if (el2.nutrientName === el1.nutrientName) {
      //         el2.value += el1.value;
      //       } else if (
      //         !newMicro.find((ele) => ele.nutrientName === el1.nutrientName)
      //       ) {
      //         newMicro.push(el1);
      //       }
      //     });
      //   });
      //   totMicros = totMicros.concat(newMicro);
    }
  });

  res.status(200).json({
    status: 'success',
    data: {
      nutriProfile: {
        totEnergy,
        totMacros,
        totMicros,
        note,
      },
    },
  });
};

//get the nutriprofile
exports.getNutriProfile = catchAsync(async (req, res, next) => {
  const { ingredientsList } = req.body;
  //const filteredProfile = [];

  if (!ingredientsList.length)
    throw new AppError('Please provide an ingredient list :(', 400);

  ingredientsList.forEach((el) => {
    el.nutrientProfile.foodNutrients = calcMicroMacro(
      el.nutrientProfile.foodNutrients
    );
  });

  //   res.status(200).json({
  //     status: 'success',
  //     data: {
  //       ingredientsList,
  //     },
  //   });

  next();
});

// get top 100 recipes
exports.getTop100 = catchAsync(async (req, res, next) => {
  const recipes = await Recipe.find()
    .sort({ hits: -1, createdAt: -1 })
    .limit(100);

  res.status(200).json({
    status: 'success',
    recipes,
  });
});

//get recipes according to cuisines
exports.getRecipesAccToCuisine = catchAsync(async (req, res, next) => {
  const cuisinesArr = req.params.cuisinesArr.split(',');

  if (!checkIfPresent(cuisineList, cuisinesArr))
    throw new AppError('Please enter a valid cuisine :(', 400);

  const recipes = await Recipe.find({
    cuisine: { $in: cuisinesArr },
  }).sort({ hits: -1, createdAt: -1 });

  res.status(200).json({
    status: 'success',
    recipes,
  });
});

//get recipes according to tags
exports.getRecipesAccToTags = catchAsync(async (req, res, next) => {
  const tagsArr = req.params.tagsArr.split(',');

  if (!checkIfPresent(tagList, tagsArr))
    throw new AppError('Please enter a valid tag name :(', 400);

  const recipes = await Recipe.find({
    tags: { $in: tagsArr },
  }).sort({ hits: -1, createdAt: -1 });

  res.status(200).json({
    status: 'success',
    recipes,
  });
});

//get recipes according to category
exports.getRecipesAccToCategory = catchAsync(async (req, res, next) => {
  if (!checkIfPresent(categoryList, req.params.categoryName))
    throw new AppError('Please enter a valid category :(', 400);

  const recipes = await Recipe.find({
    category: req.params.categoryName,
  }).sort({ hits: -1, createdAt: -1 });

  res.status(200).json({
    status: 'success',
    recipes,
  });
});

//Search engine
//TODO: on the front end when the page is loading i can query all the recipe names and store it inside of an array and then
//can use it for autocompletion purpose
exports.searchEngine = catchAsync(async (req, res, next) => {
  //get all the recipes
  const recipes = await Recipe.find();

  //console.log(req.params.searchQuery, recipes);

  //create the search engine
  const miniSearch = new MiniSearch({
    fields: ['name', 'description'],
    storeFields: ['name'],
    searchOptions: {
      boost: { name: 2 },
      fuzzy: 0.2,
      prefix: true,
    },
  });

  //index the document
  miniSearch.addAll(recipes);

  //result
  const result = miniSearch.search(req.params.searchQuery);

  //if no result found then throw an error
  if (!result.length)
    throw new AppError('No recipes found for your search :(', 200);

  //use this in front end for auto completion
  // const suggest = miniSearch.autoSuggest('oat');
  // console.log(suggest);

  req.searchResult = result.map((el) => el.name);

  //test
  // res.status(200).json({
  //   status: 'success',
  //   result,
  // });

  next();
});

//sort the result according to given data
exports.getSearchDocs = catchAsync(async (req, res, next) => {
  let recipes;

  const sortList = ['popularity', 'newly-added', 'cooking-time', 'most-liked'];
  const sort = sortList.find((el) => el === req.query.sort) || 'popularity';

  if (sort === 'cooking-time') {
    recipes = await Recipe.find({
      name: { $in: req.searchResult },
    }).sort({ cookingTime: 1, hits: -1 });
  } else if (sort === 'newly-added') {
    recipes = await Recipe.find({
      name: { $in: req.searchResult },
    }).sort({ createdAt: -1, hits: -1 });
  } else if (sort === 'most-liked') {
    recipes = await Recipe.find({
      name: { $in: req.searchResult },
    }).sort({ likes: -1, hits: -1 });
  } else {
    recipes = await Recipe.find({
      name: { $in: req.searchResult },
    }).sort({ hits: -1, createdAt: -1 });
  }

  res.status(200).json({
    status: 'success',
    recipes,
  });
});

//increasing or decreasing the likes
exports.likesManager = catchAsync(async (req, res, next) => {
  //get the recipe id from the params
  const { recipeId } = req.params;

  //check whether the recipeId already exist in the users liked recipes
  const user = await User.findById(req.user._id);
  const { likedRecipes } = user;

  let index = -1;
  /*eslint eqeqeq: ["warn", "smart"]*/
  if (likedRecipes)
    index = likedRecipes.findIndex((el) => `${el}` === `${recipeId}`);

  if (index === -1) {
    user.likedRecipes.push(recipeId);
    await user.save({ validateModifiedOnly: true });

    //update the recipe likes
    const recipe = await Recipe.findById(recipeId);
    recipe.likes += 1;
    await recipe.save();
  } else {
    user.likedRecipes.splice(index, index + 1);
    await user.save({ validateModifiedOnly: true });

    //update the recipe likes
    const recipe = await Recipe.findById(recipeId);
    recipe.likes -= 1;
    await recipe.save();
  }

  res.status(200).json({
    status: 'success',
  });
});

//Generic Ones
exports.createRecipe = CRUDfactory.genericCreate(Recipe);
exports.getOneRecipe = CRUDfactory.genericGetOne(Recipe);
exports.getAllRecipe = CRUDfactory.genericGetAll(Recipe);
exports.updateOneRecipe = CRUDfactory.genericUpdateOne(Recipe);
exports.deleteOneRecipe = CRUDfactory.genericDeleteOne(Recipe);
