import express from 'express';
import * as UserController from './user.controller';

const router = express.Router();

// مسارات المستخدم
router.post('/', UserController.createUser);
router.get('/', UserController.getAllUsers);
router.get('/:id', UserController.getUserById);
router.put('/:id', UserController.updateUser);
router.delete('/:id', UserController.deleteUser);
router.post('/login', UserController.login);



export default router;