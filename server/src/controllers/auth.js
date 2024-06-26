const db = require('../db');
const { hash } = require('bcrypt');
const { sign } = require('jsonwebtoken');
const { SECRET } = require('../constants/index');
const { generateOptimalPaths } = require('../../lpsolver/node_modules/javascript-lp-solver/model');

exports.protected = (req, res) => {
    try {
        res.status(200).json({
            info: 'protected info'
        });
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
    const user = req.user;
    const payload = {
        id: user.user_id,
        email: user.email
    };
    try {
        const token = await sign(payload, SECRET); //create jwt token
        return res.status(200).cookie('token', token, { httpOnly: true, secure: true }).json({ //send the user a cookie
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

//generate the schedule
exports.generate = async (req, res) => {
    const { selectedDoctors } = req.body;
    try {
        const data = await generateOptimalPaths(selectedDoctors);
        res.status(200).json({
            results: data.results,
            days: data.days,
            doctors: data.doctors,
            nodes: data.nodes,
            dummyDestinationNodes: data.dummyDestinationNodes
        });
    } catch(error) {
        console.log(error.message);
        res.status(500).json({
            error: error.message
        });
    }
};