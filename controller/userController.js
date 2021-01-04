const User = require('../models/UserModel');
//const catchAsync = require('../utils/catchAsync');
const CRUDfactory = require('../utils/CRUDfactory');

exports.createUser = CRUDfactory.genericCreate(User);
exports.getOneUser = CRUDfactory.genericGetOne(User);
exports.getAllUser = CRUDfactory.genericGetAll(User);
exports.updateOneUser = CRUDfactory.genericUpdateOne(User);
exports.deleteOneUser = CRUDfactory.genericDeleteOne(User);
