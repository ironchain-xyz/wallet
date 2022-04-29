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
    origin: "http://localhost:8081"
};

app.use(cors(corsOptions));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(cookieParser());
app.use(session({
    secret: process.env.SESSION_SECRET,
    cookie: { maxAge: 10000 },
    saveUninitialized: true,
    resave: false,
    rolling: true,
}));

const db = require("./app/models");
if (process.env.NODE_ENV == 'production') {
    db.sequelize.sync();
} else {
    db.sequelize.sync({ force: true }).then(() => {
        console.log("Drop and re-sync db.");
    });
}

app.get('/login', function (req,res) {
    session = req.session;
    if (session.email) {
        res.redirect('/');
    } else {
        res.sendFile(path + "login.html");
    }
});

app.get('/', function (req,res) {
    session = req.session;
    if (session.email) {
        res.sendFile(path + "index.html");
    } else {
        res.redirect('/login');
    }
});

require("./app/routes/api.routes")(app);

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}.`);
});
