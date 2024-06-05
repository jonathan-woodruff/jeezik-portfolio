const express = require('express');
const app = express();
const { PORT } = require('./constants/index');
const authRoutes = require('./routes/auth');
const cookieParser = require('cookie-parser');

app.use(express.json()); //parses incoming requests with JSON payloads and enables you to use req.body
app.use(cookieParser()); //gives you access to req.cookies or req.signedCookies

//initialize routes
app.use('/auth', authRoutes); //mount the router at /auth

//app start
const appStart = () => {
    try {
        app.listen(PORT, () => {
            console.log(`The app is running at http://localhost/${PORT}`);
        })
    } catch(error) {
        console.log(`Error: ${error.message}`);
    }
};

appStart();