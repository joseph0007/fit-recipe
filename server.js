const mongoose = require('mongoose');
const dotenv = require('dotenv');
const app = require('./app');

//setting the environment variables
dotenv.config({
  path: `${__dirname}/config.env`,
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

const port = process.env.PORT || 3000;

app.listen(port, () => {
  console.log('application started...');
});
