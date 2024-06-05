const { check } = require('express-validator');
const { compare } = require('bcrypt');
const db = require('../db');

//password
const password = check('password').isLength({ min: 6, max: 15}).withMessage('Password must be between 6 and 15 characters.');

//email
const email = check('email').isEmail().withMessage('Please enter a valid email address.');

//check if email and password combination exists
const emailExists = check('email').custom(async (value) => {
    const { rows } = await db.query(`SELECT * FROM users WHERE email = $1`, [value]);

    if (rows.length) {
        throw new Error('Email already exists');
    }
});

//login validation
const loginFieldsCheck = check('email').custom(async (value, { req }) => {
    const user = await db.query(`SELECT * FROM users WHERE email = $1`, [value]);
    if (!user.rows.length) {
        throw new Error('Email does not exist');
    }
    const validPassword = await compare(req.body.password, user.rows[0].password);
    if (!validPassword) {
        throw new Error('Wrong password');
    }
    req.user = user.rows[0];
});

module.exports = {
    registerValidation: [email, password, emailExists],
    loginValidation: [loginFieldsCheck]
};
