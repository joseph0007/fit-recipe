// const axios = require('axios');
import axios from 'axios';

export const getTenNutriProfile = async (ingName) => {
  const result = await axios(
    `https://api.nal.usda.gov/fdc/v1/foods/search?query=${ingName}&pageSize=10&api_key=jF3ETihml3uU1n8pr9tYmpjHtB12mn7o8AuBGudz`
  );

  // console.log(result.data.foods);

  //TODO:
  //1.SEND THIS DATA TO VIEW CONTROLLER TO DISPLAY AND LET THE USER SELECT ONE FROM THE 10 NUTRI PROFILE
  return result.data.foods;
};
