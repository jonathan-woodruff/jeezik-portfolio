const { Router } = require('express');
const router = Router();
const { getUsers } = require('../controllers/auth');

router.get('/register', (req, res) => {
    return res.send('registration route!');
});

router.get('/get-users', getUsers);

module.exports = router;