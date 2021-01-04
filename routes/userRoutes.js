const express = require('express');
const authController = require('../controller/authController');
const userController = require('../controller/userController');
//const app = require('../app');

const router = express.Router();

//AUTHENTICATION ROUTES
router.post('/signup', authController.signup);
router.post('/login', authController.login);
router.post('/forgotpassword', authController.forgotPassword);
router.patch('/resetpassword/:token', authController.resetPassword);

router.patch(
  '/changePassword',
  authController.protect,
  authController.changePassword
);
router.delete('/deleteme', authController.protect, authController.deleteUser);

//USER MODEL CRUD OPERATIONS(ONLY ADMIN)
router.use(authController.protect, authController.allowOnly('admin'));

router.route('/').post(userController.createUser);
router.route('/').get(userController.getAllUser);

router.route('/:id').get(userController.getOneUser);
router.route('/:id').patch(userController.updateOneUser);
router.route('/:id').delete(userController.deleteOneUser);

module.exports = router;
