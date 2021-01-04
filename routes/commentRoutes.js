const express = require('express');
const authController = require('../controller/authController');
const commentController = require('../controller/commentController');

const router = express.Router({ mergeParams: true });

router.use(authController.protect);

//test
router.post('/', commentController.addIds, commentController.createComment);

router.route('/:id').patch(commentController.updateOneComment);
router.route('/:id').delete(commentController.deleteOneComment);

router.use(authController.allowOnly('admin'));

router.route('/').post(commentController.createComment);
router.route('/').get(commentController.getAllComment);
router.route('/:id').get(commentController.getOneComment);

module.exports = router;
