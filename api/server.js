require('dotenv').config();

const express = require("express");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const sessions = require('express-session');

const cors = require("cors");
const path = __dirname + '/app/views/';
const app = express();

app.use(express.static(path));

var corsOptions = {
    origin: [
        "http://localhost:8081",
        "https://localhost:8081"
    ],
    credentials: true,
    exposedHeaders: ['set-cookie']
};
app.use(cors(corsOptions));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(cookieParser());
app.use(sessions({
    secret: process.env.SESSION_SECRET,
    cookie: { maxAge: 10000 },
    saveUninitialized: false,
    resave: false,
    rolling: true,
}));

const db = require("./models");
if (process.env.NODE_ENV == 'production') {
    db.sequelize.sync();
} else {
    db.sequelize.sync({ force: false }).then(() => {
        console.log("Drop and re-sync db.");
    });
}

const jwt = require('jsonwebtoken');
const asyncHandler = require('express-async-handler')
const secret = process.env.TOKEN_SECRET;
app.use(asyncHandler(async (req, res, next) => {
    if (req.path.startsWith("/static")) {
        return next();
    }
    if (req.path.startsWith("/api/auth")) {
        return next();
    }

    const accessToken = req.headers["x-access-token"];
    if (accessToken) {
        try {
            const {refreshToken} = await jwt.verify(accessToken, secret);
            const {email} = jwt.verify(refreshToken, secret)
            req.user = {email};
            next();
        } catch (err) {
            res.status(401).send({
                message: "Invalid access Token"
            });
        }
    } else {
        res.status(403).send({
            message: "Access token is required"
        });
    }
}));

const auth = require('./routes/auth.route');
app.use('/api/auth/', auth);

const upload = require('./routes/evidence.route');
app.use('/api/evidence/', upload);

const fact = require('./routes/fact.route');
app.use('/api/fact/', fact);

const main = require('./routes/main.route');
app.use('/api/', main);

app.use('/static/evidences', express.static(__dirname + '/files/evidences'));

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}.`);
});
