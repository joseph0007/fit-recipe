const convert = require('convert-units');

module.exports = (req, res, next) => {
  //get the array of ingredient objects where the each object will have name, quantity, unit
  const { ingredientsList } = req.body;

  //map over the array to convert each unit to gms or ml
  ingredientsList.forEach((el) => {
    el.quantity = convert(parseInt(el.quantity, 10))
      .from(el.unit)
      .to(/(g|kg|oz|lb)/.test(el.unit) ? 'g' : 'ml');
    el.unit = /(g|kg|oz|lb)/.test(el.unit) ? 'g' : 'ml';
  });

  next();
};
