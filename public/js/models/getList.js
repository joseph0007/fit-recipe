import Axios from 'axios';

const getList = async () => {
  const data = await Axios({
    method: 'GET',
    url: `http://127.0.0.1:3000/api/v0/recipes`,
  });

  const recipeList = data.data.data.doc;

  return Array.from(new Set(recipeList.map((el) => el.cuisine)));
};

export default getList;
