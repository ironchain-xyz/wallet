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
    db.sequelize.sync({ force: true }).then(() => {
        console.log("Drop and re-sync db.");
    });
}

require("./routes/auth.route")(app);
require("./routes/main.route")(app);

var dir = path.join(__dirname, 'public');
app.use(express.static(dir));

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}.`);
});
