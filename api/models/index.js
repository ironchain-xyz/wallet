const dbConfig = require("../config/db.config.js");
const Sequelize = require("sequelize");

const sequelize = new Sequelize(
    dbConfig.DB,
    dbConfig.USER,
    dbConfig.PASSWORD,
    {
        host: dbConfig.HOST,
        dialect: dbConfig.dialect,
        pool: {
          max: dbConfig.pool.max,
          min: dbConfig.pool.min,
          acquire: dbConfig.pool.acquire,
          idle: dbConfig.pool.idle
        }
    }
);

const db = {};
db.sequelize = sequelize;

db.users = require("./user.model.js")(sequelize);
db.invitations = require("./invitation.model.js")(sequelize, db.users);

db.rawFiles = require("./rawFile.model.js")(sequelize);
db.evidences = require("./evidence.model.js")(sequelize, db.rawFiles);
db.materials = require("./material.model.js")(sequelize, db.users, db.evidences);
db.spaces = require("./space.model.js")(sequelize, db.users, db.materials);
db.subscriptions = require("./subscription.model.js")(sequelize, db.spaces, db.users);

module.exports = db;
