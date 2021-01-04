const fs = require('fs');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
// const app = require('../app');
const Recipe = require('../models/RecipeModel');

const recipes = JSON.parse(
  fs.readFileSync(`${__dirname}/recipes.json`, {
    encoding: 'utf-8',
  })
);

dotenv.config({
  path: `${__dirname}/../config.env`,
});

let database = process.env.DATABASE;
database = database
  .replace('<password>', process.env.DATABASE_PASSWORD)
  .replace('<dbname>', process.env.DATABASE_NAME);

mongoose.connect(
  database,
  {
    useUnifiedTopology: true,
    useCreateIndex: true,
    useNewUrlParser: true,
    useFindAndModify: false,
  },
  (err) => {
    if (err) console.log('😢 Database Connection Failed', err);
    else console.log('connection successful');
  }
);

if (process.argv[2] === '--import') {
  Recipe.create(recipes)
    .then(() => {
      console.log('imported');
      process.exit();
    })
    .catch((err) => console.log(err));
} else if (process.argv[2] === '--delete') {
  Recipe.deleteMany({})
    .then(() => {
      console.log('deleted files');
      process.exit();
    })
    .catch((err) => console.log(err));
}
