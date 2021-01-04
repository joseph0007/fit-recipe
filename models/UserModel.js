const crypto = require('crypto');
const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');

const userSchema = mongoose.Schema({
  name: {
    type: String,
    required: [true, 'User must provide a name!'],
    maxlength: [20, 'User name should not exceed 20 characters'],
    minlength: [2, 'User name should atleast contain 2 characters'],
  },
  email: {
    type: String,
    required: [true, 'User must provide a email!'],
    validate: {
      validator: validator.isEmail,
      message: 'Please provide a valid email',
    },
    unique: [true, 'email already in the database'],
  },
  photo: {
    type: String,
    default: 'default.jpg',
  },
  password: {
    type: String,
    required: [true, 'User must provide a password'],
    maxlength: [20, 'User password should not exceed 20 characters'],
    minlength: [8, 'User password should atleast contain 8 characters'],
    select: false,
  },
  confirmPassword: {
    type: String,
    validate: {
      validator: function () {
        return this.confirmPassword === this.password;
      },
      message: 'password and confirm password do not match try again',
    },
    required: [true, 'User must confirm the password!'],
  },
  createdAt: {
    type: Date,
    default: Date.now(),
  },
  author: {
    type: Boolean,
    default: false,
  },
  passChangedAt: {
    type: Date,
  },
  resetToken: String,
  resetTokenExpiry: Date,
  active: {
    type: Boolean,
    default: true,
    select: false,
  },
  role: {
    type: String,
    default: 'user',
  },
  socials: [
    {
      type: {
        type: String,
        enum: ['facebook', 'instagram', 'youtube', 'google', 'others'],
        required: [true, 'please select your social account type!'],
        default: 'others',
      },
      link: {
        type: String,
        required: [true, 'please provide a link to your social account!'],
      },
    },
  ],
  likedRecipes: [
    {
      type: mongoose.Schema.ObjectId,
      ref: 'Recipe',
    },
  ],
});

//works for create and save query
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();

  //hash the password
  this.password = await bcrypt.hash(this.password, 12);

  //set the confirmPassword field to undefined which will remove this field from the document
  this.confirmPassword = undefined;

  next();
});

//to check if password is modified and the document is new
userSchema.pre('save', function (next) {
  if (this.isModified('password') && !this.isNew) {
    this.passChangedAt = Date.now() - 1000;
  }

  next();
});

//static method
userSchema.statics.isPassCorrect = async function (userPass, hashedPass) {
  return await bcrypt.compare(userPass, hashedPass);
};

userSchema.methods.isPassChanged = function (issuedDate) {
  if (this.passChangedAt) {
    const passChangedAt = this.passChangedAt.getTime() / 1000;

    return passChangedAt > issuedDate;
  }

  return false;
};

userSchema.methods.getResetToken = function () {
  //create random bytes
  const random = crypto.randomBytes(32).toString('hex');

  //encode the randomm bytes
  this.resetToken = crypto.createHash('sha256').update(random).digest('hex');

  //expiry of the token set to 10 minutes
  this.resetTokenExpiry = Date.now() + 10 * 60 * 1000;

  return random;
};

const User = mongoose.model('User', userSchema);

module.exports = User;
