const { DataTypes } = Sequelize = require("sequelize");

module.exports = (sequelize, User, Evidence) => {
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

    Record.hasMany(Evidence, {as: "evidences"});
    Evidence.belongsTo(Record);
    return Record;
};