const { DataTypes, STRING } = require("sequelize");

module.exports = (sequelize, RawFile) => {
    const File = sequelize.define("files", {
        hash: {
            type: DataTypes.STRING,
            primaryKey: true,
        },
        mimeType: {
            type: DataTypes.STRING,
        },
        encoding: {
            type: DataTypes.STRING,
        },
        name: {
            type: DataTypes.STRING,
        },
        size: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        contentHash: {
            type: DataTypes.STRING,
            allowNull: false,
        }
    }, {
        indexes: [
            {
                fields: ['contentHash']
            }
        ]
    });
    return File;
}