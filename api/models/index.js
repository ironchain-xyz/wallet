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

db.invitations = require("./invitation.model.js")(sequelize);
db.users = require("./user.model.js")(sequelize);

const {RawFile, Evidence}= require("./evidence.model.js")(sequelize);
db.evidences = Evidence;
db.rawFiles = RawFile;

db.records = require("./record.model.js")(sequelize);

db.evidences = require("./evidence.model.js")(sequelize);
db.collections = require("./collection.model.js")(sequelize);
db.reference = require("./reference.model.js")(sequelize);

module.exports = db;
