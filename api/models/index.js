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
db.Sequelize = Sequelize;
db.sequelize = sequelize;

db.invitations = require("./invitation.model.js")(sequelize, Sequelize);
db.users = require("./user.model.js")(sequelize, Sequelize);
const {Fact, File} = require("./fact.model.js")(sequelize, Sequelize);
db.facts = Fact;
db.files = File;

db.facts.belongsToMany(db.users, {as: "collectedBy", through: "user_facts_collection"});
db.users.belongsToMany(db.facts, {as: "collections", through: "user_facts_collection"});
db.users.hasMany(db.facts, {
    as: "createdFacts",
    foreignKey: {
        name: "createdBy",
        allowNull: false
    }
});
db.facts.belongsTo(db.users, {
    as: "creator",
    foreignKey: {
        name: "createdBy",
        allowNull: false
    }
});

db.users.hasMany(db.files, {
    as: "createdFiles",
    foreignKey: {
        name: "createdBy",
        allowNull: false
    }
});
db.files.belongsTo(db.users, {
    as: "creator",
    foreignKey: {
        name: "createdBy",
        allowNull: false
    }
});

db.users.hasMany(db.invitations, {
    as: "invitations",
    foreignKey: {
        name: "createdBy",
        allowNull: false
    }
});
db.invitations.belongsTo(db.users, {
    as: "creator",
    foreignKey: {
        name: "createdBy",
        allowNull: false
    }
});

db.users.hasOne(db.invitations, {
    as: "referredBy",
    foreignKey: {
        name: "usedBy",
    }
});
db.invitations.belongsTo(db.users, {
    as: "beneficiary",
    foreignKey: {
        name: "usedBy",
    }
});

module.exports = db;
