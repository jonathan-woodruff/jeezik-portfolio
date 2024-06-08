const { Router } = require('express');
const router = Router();
const { getUsers, register, login, protected, logout } = require('../controllers/auth');
const { registerValidation, loginValidation } = require('../validators/auth');
const { validationMiddleware } = require('../middlewares/validation-middleware');
const { userAuth } = require('../middlewares/auth-middleware');
const { generateOptimalPaths } = require('../../lpsolver/node_modules/javascript-lp-solver/model');

router.get('/get-users', getUsers);
router.get('/protected', userAuth, protected);
router.post('/register', registerValidation, validationMiddleware, register);
router.post('/login', loginValidation, validationMiddleware, login);
router.get('/logout', logout);
router.get('/generate', generateOptimalPaths)

module.exports = router;