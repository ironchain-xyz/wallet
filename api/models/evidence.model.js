const { DataTypes } = require("sequelize");

module.exports = (sequelize, RawFile) => {
    const Evidence = sequelize.define("evidences", {
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

    RawFile.hasMany(Evidence, {foreignKey: "raw"});
    Evidence.belongsTo(RawFile, {foreignKey: "raw"});
    return Evidence;
}