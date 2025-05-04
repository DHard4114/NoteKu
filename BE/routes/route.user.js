const userController = require('../controllers/controller.user');
const express = require('express');
const router = express.Router();

router.get('/getAll', userController.getAllUsers);
router.post('/register', userController.registerUser);
router.post('/login', userController.loginUser);
router.put('/', userController.updateUserbyID);
router.delete('/:id', userController.deleteUserID);
router.get('/:email', userController.getUserbyEmail);

module.exports = router;