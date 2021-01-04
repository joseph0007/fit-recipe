const path = require('path');
const express = require('express');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
const helmet = require('helmet');
const mongoSanitizer = require('express-mongo-sanitize');
const xss = require('xss-clean');
const hpp = require('hpp');
const cookieParser = require('cookie-parser');
const compression = require('compression');
const cors = require('cors');

const errorHandler = require('./controller/errorController');
const userRouter = require('./routes/userRoutes');
const recipeRouter = require('./routes/recipeRoutes');
const ingredientRouter = require('./routes/ingredientRoutes');
const commentRouter = require('./routes/commentRoutes');
const AppError = require('./utils/AppError');

const app = express();

//to enable trust proxy
app.enable('trust proxy');

//this will enable CORS for all the routes
app.use(cors());

//enabling non-simple request CORS on all the routes
app.options('*', cors());

//body parser
app.use(express.json());

app.use(express.static(path.join(__dirname, 'public')));

app.use(function (req, res, next) {
  res.header('Access-Control-Allow-Origin', req.headers.origin);
  res.header(
    'Access-Control-Allow-Headers',
    'Origin, X-Requested-With, Content-Type, Accept'
  );
  next();
});

app.use(
  helmet.contentSecurityPolicy({
    directives: {
      defaultSrc: ["'self'", 'https:', 'http:', 'data:', 'ws:'],
      baseUri: ["'self'"],
      fontSrc: ["'self'", 'https:', 'http:', 'data:'],
      scriptSrc: ["'self'", 'https:', 'http:', 'blob:'],
      styleSrc: ["'self'", "'unsafe-inline'", 'https:', 'http:'],
    },
  })
);

const limiter = rateLimit({
  max: 100,
  windowMs: 60 * 60 * 1000,
  message:
    'Too many requests from this IP address.Please try again after one hour!',
});

//for all the request that start with /api resource locator
app.use('/api', limiter);

app.use(mongoSanitizer());

//to prevent cross site scripting(xss) which basically means injecting some malicious html code that has some js attached to it
app.use(xss());

//to prevent parameter population
app.use(
  hpp({
    whitelist: ['duration', 'ratingsAverage', 'difficulty', 'price'],
  })
);

app.use(compression());

//cookie parser
app.use(cookieParser());

app.use((req, res, next) => {
  console.log(req.cookies, 'hello');

  res.cookie('name', 'joseph');

  next();
});

if (process.env.NODE_ENV === 'development') app.use(morgan('dev'));

app.use('/api/v0/users', userRouter);
app.use('/api/v0/recipes', recipeRouter);
app.use('/api/v0/ingredients', ingredientRouter);
app.use('/api/v0/comments', commentRouter);

app.all('*', (req, res, next) => {
  return next(new AppError('Route not found on the server!', 404));
});

app.use(errorHandler);

module.exports = app;
