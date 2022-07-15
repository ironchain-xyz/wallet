const { DataTypes } = require("sequelize");

module.exports = (sequelize, RawFile) => {
    const File = sequelize.define("evidences", {
        hash: {
            type: DataTypes.STRING,
        },
        mimeType: {
            type: DataTypes.STRING,
        },
        name: {
            type: DataTypes.STRING,
        },
    });

    RawFile.hasMany(File, {foreignKey: "raw"});
    File.belongsTo(RawFile, {foreignKey: "raw"});
    return File;
}