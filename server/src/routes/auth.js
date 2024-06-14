const { Router } = require('express');
const router = Router();
const { protected, register, login, logout, generate } = require('../controllers/auth');
const { registerValidation, loginValidation, generateValidation } = require('../validators/auth');
const { validationMiddleware } = require('../middlewares/validation-middleware');
const { userAuth } = require('../middlewares/auth-middleware');

router.get('/protected', userAuth, protected);
router.post('/register', registerValidation, validationMiddleware, register);
router.post('/login', loginValidation, validationMiddleware, login);
router.get('/logout', logout);
router.post('/generate', userAuth, generateValidation, validationMiddleware, generate);

module.exports = router;