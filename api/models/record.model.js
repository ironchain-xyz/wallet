const { DataTypes } = Sequelize = require("sequelize");

module.exports = (sequelize) => {
    const Record = sequelize.define("records", {
        hash: {
            type: DataTypes.STRING,
            primaryKey: true,
        },
        description: {
            type: DataTypes.TEXT,
        },
        evidenceHashes: {
            type: DataTypes.ARRAY(DataTypes.STRING),
            defaultValue: []
        },
        referenceHashes: {
            type: DataTypes.ARRAY(DataTypes.STRING),
            defaultValue: []
        }
    });

    const User = require("./user.model.js")(sequelize);
    User.hasMany(Record, {
        as: "createdFacts",
        foreignKey: {
            name: "createdBy",
            allowNull: false
        }
    });
    Record.belongsTo(User, {
        as: "creator",
        foreignKey: {
            name: "createdBy",
            allowNull: false
        }
    });

    const {Evidence} = require("./evidence.model.js")(sequelize);
    Record.hasMany(Evidence);
    Evidence.belongsTo(Record);
    return Record;
};