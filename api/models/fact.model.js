const { DataTypes, Deferrable } = Sequelize = require("sequelize");

module.exports = (sequelize, Sequelize) => {
    const File = sequelize.define("Files", {
        hash: {
            type: DataTypes.STRING,
            primaryKey: true,
        },
        mimeType: {
            type: DataTypes.STRING,
        },
        name: {
            type: DataTypes.STRING,
        },
        size: {
            type: DataTypes.INTEGER,
        },
        contentHash: {
            type: DataTypes.STRING,
            allowNull: false,
        },
    });

    const Fact = sequelize.define("facts", {
        hash: {
            type: DataTypes.STRING,
            primaryKey: true,
        },
        description: {
            type: DataTypes.TEXT,
        },
        evidences: {
            type: DataTypes.ARRAY(DataTypes.STRING),
            defaultValue: [],
        },
        references: {
            type: DataTypes.ARRAY(DataTypes.STRING),
            defaultValue: [],
        }
    });
    return {Fact, File};
};