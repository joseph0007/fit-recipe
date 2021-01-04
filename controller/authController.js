const crypto = require('crypto');
const { promisify } = require('util');
const jwt = require('jsonwebtoken');
const User = require('../models/UserModel');
const AppError = require('../utils/AppError');
const catchAsync = require('../utils/catchAsync');
const Email = require('../utils/Email');

const createToken = (payload) => {
  return jwt.sign({ id: payload }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });
};

const sendCookieAndResponse = (req, res, token) => {
  // create a cookie
  const cookieOptions = {
    expires: new Date(
      Date.now() + process.env.JWT_COOKIE_EXPIRE * 24 * 60 * 60 * 1000
    ),
    //makes so that cookies are sent and recieved over a secure connection
    // secure: req.secure || req.headers['x-forwarded-proto'] === 'https',
    //makes so that the browser only sends and receives cookie data and not concerned with what is inside the cookie
    //this makes it more secure as hackers cannot access the contents of the cookie
    httpOnly: false,
  };

  res.cookie('jwt', token, cookieOptions);

  //sending the response
  res.status(200).json({
    status: 'success',
    token,
  });
};

//login function
exports.login = catchAsync(async (req, res, next) => {
  // get the email password
  // user passing some values is taken care in the html part
  const { email, password } = req.body;

  // retrieve the document
  const user = await User.findOne({ email }).select('+password +active');

  //check if the user is deleted or not
  if (
    !user ||
    user.active === false ||
    !(await User.isPassCorrect(password, user.password))
  ) {
    // if the password is correct then skip
    return next(new AppError('Please provide a valid email or password', 401));
  }

  // send a jwt token and response
  sendCookieAndResponse(req, res, createToken(user._id));
});

//signup function
exports.signup = catchAsync(async (req, res, next) => {
  //check if the user was previously deleted or not
  let user = await User.findOne({ email: req.body.email }).select('+active');

  if (user && user.active === false) {
    user.active = true;
    user.password = req.body.password;
    user.confirmPassword = req.body.confirmPassword;
    user = await user.save();
  } else {
    // 1.get the user details from the sign up form
    user = await User.create({
      name: req.body.name,
      email: req.body.email,
      password: req.body.password,
      confirmPassword: req.body.confirmPassword,
      // photo:
    });
  }

  // 2.create the token
  const token = createToken(user._id);

  // 3.send the token as a cookie to the user
  sendCookieAndResponse(req, res, token);
});

// proctect middleware
exports.protect = catchAsync(async (req, res, next) => {
  const { authorization } = req.headers;
  let token;

  //get the jwt token from the authorization header or cookies
  if (authorization && authorization.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
  } else if (req.cookies.jwt) {
    token = req.cookies.jwt;
  }

  //if no token then throw an error
  if (!token) throw new AppError('Login failed!! Please try again :)', 401);

  //retrieve the encoded id
  const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);

  //check if user is still present in the database or not
  const user = await User.findById(decoded.id);

  //check if the iat time is <= passChangedAt time
  if (user.isPassChanged(decoded.iat))
    throw new AppError('Token expired please login again!', 401);

  //if all the above conditions are met then the user is real and the token has not expired
  req.user = user;
  next();
});

exports.changePassword = catchAsync(async (req, res, next) => {
  //get the passwords from the body
  const { curPassword, newPassword, confirmPassword } = req.body;

  const user = await User.findById(req.user._id).select('+password');

  //confirm the curPassword
  if (!(await User.isPassCorrect(curPassword, user.password)))
    throw new AppError(
      'You have entered the wrong current Password!! Please try again ;)'
    );

  //just update the document and call save on it which will trigger the 'save' middleware
  user.password = newPassword;
  user.confirmPassword = confirmPassword;

  //by default the save() will run validators
  await user.save();

  //create a token and send
  sendCookieAndResponse(req, res, createToken(user._id));
});

//FORGOT PASSWORD
exports.forgotPassword = catchAsync(async (req, res, next) => {
  //get the email address (validation done by html)
  const { email } = req.body;

  //check if the email exists in the database
  const user = await User.findOne({ email });

  //if there exist a user then create a simple hash
  const resetToken = user.getResetToken();

  //save the document with the token and expiry
  await user.save({ validateBeforeSave: false });

  //construct the resetpassword url
  const url = `${req.protocol}://${req.hostname}/api/v0/users/resetpassword/${resetToken}`;

  //send the mail using nodemailer
  try {
    await new Email(user, 'RESET PASSWORD').sendResetEmail(url);

    res.status(200).json({
      status: 'success',
      message: 'Please check your mail for password reset',
    });
  } catch (err) {
    user.resetToken = undefined;
    user.resetTokenExpiry = undefined;
    await user.save({ validateBeforeSave: false });

    res.status(500).json({
      status: 'fail',
      message: 'Cannot send mail now! Please try again later :(',
    });
  }
});

//RESET PASSWORD
exports.resetPassword = catchAsync(async (req, res, next) => {
  //get the resetToken and hash it
  const resetToken = crypto
    .createHash('sha256')
    .update(req.params.token)
    .digest('hex');

  //get the user document that has the same hash
  const user = await User.findOne({
    resetToken,
    resetTokenExpiry: { $gt: Date.now() },
  });

  if (!user)
    throw new AppError(
      'Token has expired! Please return to the site and forgot password again :(',
      408
    );

  //set the new password on the document
  user.password = req.body.password;
  user.confirmPassword = req.body.confirmPassword;
  user.resetToken = undefined;
  user.resetTokenExpiry = undefined;

  await user.save();

  //send new JWT token and log in
  sendCookieAndResponse(req, res, createToken(user._id));
});

//DELETE USER
exports.deleteUser = catchAsync(async (req, res, next) => {
  //get the user email and password
  const { email, password } = req.body;

  //check if the user exists & password is correct
  const user = await User.findOne({ email }).select('+password');

  if (!user || !(await User.isPassCorrect(password, user.password)))
    throw new AppError('Invalid email or password!', 401);

  //delete user (we dont actually delete the user but set the active property to false)
  user.active = false;
  await user.save({ validateBeforeSave: false });

  //send response
  res.status(204).json({
    status: 'success',
    message: 'user deleted',
  });
});

//RESTRICT FUNCTION
exports.allowOnly = function (...roles) {
  return (req, res, next) => {
    if (roles.find((el) => el === req.user.role)) return next();

    next(
      new AppError(
        'You do not have the permission to perform the action!!',
        403
      )
    );
  };
};
