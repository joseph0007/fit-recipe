const multer = require('multer');
const sharp = require('sharp');
const AppError = require('./AppError');
const catchAsync = require('./catchAsync');

const storage = multer.memoryStorage({
  fieldSize: '1mb',
});

//muterFilter options to check the file type
const multerFilter = (req, file, cb) => {
  if (!file.mimetype.startsWith('image')) {
    return cb(new AppError('Please upload only an image file!', 403), false);
  }

  //if no error then call the next middleware!!
  cb(null, true);
};

const upload = multer({
  storage: storage,
  fileFilter: multerFilter,
});

//exporting a multer upload function
exports.uploadImage = upload.single('photo');

//image proccessing using sharp
exports.processImage = catchAsync(async (req, res, next) => {
  if (!req.file) return next();

  if (req.originalUrl.includes('recipes'))
    req.file.filename = `recipe-${req.body.title}-${Date.now()}.jpeg`;
  else if (req.originalUrl.includes('users'))
    req.file.filename = `user-${req.user._id}-${Date.now()}.jpeg`;

  //process the image and store it inside the file for then be updated into the database
  await sharp(req.file.buffer)
    .resize(500, 500)
    .toFormat('jpeg')
    .jpeg({ quality: 90 })
    .toFile(
      `public/img/${req.originalUrl.includes('recipes') ? 'recipe' : 'user'}/${
        req.file.filename
      }`
    );

  next();
});
