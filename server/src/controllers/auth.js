const db = require('../db');
const { hash } = require('bcrypt');
const { sign } = require('jsonwebtoken');
const { SECRET } = require('../constants/index');

exports.getUsers = async (req, res) => {
    try {
        const { rows } = await db.query(`SELECT user_id, email FROM users`);
        return res.status(200).json({
            success: true,
            users: rows
        })
    } catch(error) {
        console.log(error.message);
    }
};

exports.register = async (req, res) => {
    const { email, password } = req.body;
    try {
        const hashedPassword = await hash(password, 10);
        await db.query(`INSERT INTO users (email, password) VALUES ($1, $2)`, [email, hashedPassword]);
        return res.status(201).json({
            success: true,
            message: 'The registration was successful'
        });
    } catch(error) {
        console.log(error.message);
        res.status(500).json({
            error: error.message
        });
    }
};

exports.login = async (req, res) => {
    const user = req.user; //you set req.user in validators/auth.js
    const payload = {
        id: user.user_id,
        email: user.email
    };
    try {
        const token = await sign(payload, SECRET);
        return res.status(200).cookie('token', token, { httpOnly: true, secure: true }).json({
            success: true,
            message: 'Logged in successfully'
        })
    } catch(error) {
        console.log(error.message);
        res.status(500).json({
            error: error.message
        });
    }
};

exports.protected = async (req, res) => {
    try {
        return res.status(200).json({
            info: 'protected info'
        });
    } catch(error) {
        console.log(error.message);
    }
};

//delete the cookie
exports.logout = async (req, res) => {
    try {
        return res.status(200).clearCookie('token', { httpOnly: true, secure: true }).json({
            success: true,
            message: 'Logged out successfully'
        });
    } catch(error) {
        console.log(error.message);
        res.status(500).json({
            error: error.message
        });
    }
};