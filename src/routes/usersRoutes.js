const userRoutes = require('express').Router();
const {
  createUser, getUsers, getUserById, updateUserInfo, updateUserAvatar,
} = require('../controllers/usersController');

userRoutes.post('/users', createUser);

userRoutes.get('/users', getUsers);

userRoutes.get('/users/:userId', getUserById);

userRoutes.patch('/users/me', updateUserInfo);

userRoutes.patch('/users/me/avatar', updateUserAvatar);

module.exports = userRoutes;
