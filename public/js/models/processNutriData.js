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

export const processNutriProfile = (data) => {
  //select only the necessary fields required
  const newData = data.map((el) => {
    let { description, ingredients, foodNutrients } = el;

    ingredients =
      ingredients === undefined ? 'no ingredients listed' : ingredients;

    // processing foodNutrients
    const processedData = calcMicroMacro(foodNutrients);

    return {
      description,
      ingredients,
      processedData,
    };
  });

  return newData;
};
